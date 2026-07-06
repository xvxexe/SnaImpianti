<?php
/**
 * WordPress bridge for the static SNA Impianti site.
 *
 * The original .html pages remain in the theme root. WordPress templates call
 * snaimpianti_render_static_html() to load those files and rewrite static paths
 * into valid theme URLs at runtime.
 */

if (!defined('ABSPATH')) {
    exit;
}

if (!function_exists('str_contains')) {
    function str_contains(string $haystack, string $needle): bool
    {
        return $needle === '' || strpos($haystack, $needle) !== false;
    }
}

function snaimpianti_asset_version(string $relative_path): string
{
    $path = get_theme_file_path($relative_path);

    return file_exists($path) ? (string) filemtime($path) : '1.0.0';
}

function snaimpianti_current_static_page(): string
{
    if (is_front_page() || is_home()) {
        return 'index.html';
    }

    if (is_page()) {
        $slug = get_post_field('post_name', get_queried_object_id());
        if ($slug) {
            return sanitize_file_name($slug) . '.html';
        }
    }

    return 'index.html';
}

function snaimpianti_enqueue_assets(): void
{
    wp_enqueue_style(
        'snaimpianti-main',
        get_template_directory_uri() . '/styles.css',
        [],
        snaimpianti_asset_version('/styles.css')
    );

    if (file_exists(get_theme_file_path('/partners.css'))) {
        wp_enqueue_style(
            'snaimpianti-partners',
            get_template_directory_uri() . '/partners.css',
            ['snaimpianti-main'],
            snaimpianti_asset_version('/partners.css')
        );
    }

    if (file_exists(get_theme_file_path('/performance.css'))) {
        wp_enqueue_style(
            'snaimpianti-performance',
            get_template_directory_uri() . '/performance.css',
            ['snaimpianti-main'],
            snaimpianti_asset_version('/performance.css')
        );
    }

    wp_enqueue_script(
        'snaimpianti-script',
        get_template_directory_uri() . '/script.js',
        [],
        snaimpianti_asset_version('/script.js'),
        true
    );

    wp_localize_script('snaimpianti-script', 'SNATheme', [
        'themeUrl' => get_template_directory_uri(),
        'assetsUrl' => get_template_directory_uri() . '/assets',
        'homeUrl' => home_url('/'),
        'currentPage' => snaimpianti_current_static_page(),
    ]);
}
add_action('wp_enqueue_scripts', 'snaimpianti_enqueue_assets');

add_filter('script_loader_tag', static function (string $tag, string $handle, string $src): string {
    if ($handle !== 'snaimpianti-script') {
        return $tag;
    }

    return '<script src="' . esc_url($src) . '" defer></script>';
}, 10, 3);

function snaimpianti_page_url(string $slug): string
{
    if ($slug === '') {
        return home_url('/');
    }

    $page = get_page_by_path($slug);
    if ($page instanceof WP_Post) {
        return trailingslashit(get_permalink($page));
    }

    return home_url('/' . trim($slug, '/') . '/');
}

function snaimpianti_page_map(): array
{
    return [
        'index.html' => snaimpianti_page_url(''),
        'chi-siamo.html' => snaimpianti_page_url('chi-siamo'),
        'presentazione-aziendale.html' => snaimpianti_page_url('presentazione-aziendale'),
        'certificazioni.html' => snaimpianti_page_url('certificazioni'),
        'ingegneria.html' => snaimpianti_page_url('ingegneria'),
        'prodotti.html' => snaimpianti_page_url('prodotti'),
        'galleria.html' => snaimpianti_page_url('galleria'),
        'posizioni-aperte.html' => snaimpianti_page_url('posizioni-aperte'),
        'contatti.html' => snaimpianti_page_url('contatti'),
        'processi-saldatura-industriale.html' => snaimpianti_page_url('processi-saldatura-industriale'),
    ];
}

function snaimpianti_static_file_from_url(string $url): ?string
{
    $url = trim(html_entity_decode($url, ENT_QUOTES, 'UTF-8'));

    if ($url === '' || $url[0] === '#') {
        return null;
    }

    if (preg_match('#^(mailto|tel|sms|fax|javascript):#i', $url)) {
        return null;
    }

    $home_host = parse_url(home_url('/'), PHP_URL_HOST);
    $url_host = parse_url($url, PHP_URL_HOST);

    if ($url_host && $home_host && strtolower($url_host) !== strtolower($home_host)) {
        return null;
    }

    $path = parse_url($url, PHP_URL_PATH);
    if ($path === null || $path === false || $path === '') {
        $path = explode('#', explode('?', $url, 2)[0], 2)[0];
    }

    $path = trim($path);
    $path = preg_replace('#^https?://[^/]+#i', '', $path) ?? $path;
    $path = preg_replace('#^\./#', '', $path) ?? $path;
    $path = ltrim($path, '/');

    if ($path === '') {
        return 'index.html';
    }

    $file = basename($path);
    $file = rawurldecode($file);

    if (!preg_match('/\.html$/i', $file)) {
        return null;
    }

    return strtolower($file);
}

function snaimpianti_rewrite_static_links(string $html): string
{
    $theme_uri = trailingslashit(get_template_directory_uri());
    $page_map = snaimpianti_page_map();

    $html = preg_replace(
        '#<link\b[^>]+href=["\']https://fonts\.(?:googleapis|gstatic)\.com[^>]*>\s*#i',
        '',
        $html
    ) ?? $html;

    $html = preg_replace(
        '#<link\b[^>]+href=["\'](?:\./)?(?:styles|partners|performance)\.css(?:\?[^"\']*)?["\'][^>]*>\s*#i',
        '',
        $html
    ) ?? $html;

    $html = preg_replace(
        '#<script\b[^>]+src=["\'](?:\./)?script\.js(?:\?[^"\']*)?["\'][^>]*>\s*</script>\s*#i',
        '',
        $html
    ) ?? $html;

    $html = preg_replace_callback(
        '/\b(src|href|content|data-full)=([' . "'\"" . '])(?:\.\/|\/)?(assets\/[^' . "'\"" . ']+)\2/i',
        static function (array $match) use ($theme_uri): string {
            return $match[1] . '=' . $match[2] . esc_url($theme_uri . $match[3]) . $match[2];
        },
        $html
    ) ?? $html;

    $html = preg_replace_callback(
        '#url\((["\']?)(?:\.\/|\/)?(assets/[^)"\']+)\1\)#i',
        static function (array $match) use ($theme_uri): string {
            return 'url(' . $match[1] . esc_url($theme_uri . $match[2]) . $match[1] . ')';
        },
        $html
    ) ?? $html;

    $html = preg_replace_callback(
        '/\bhref=([' . "'\"" . '])([^' . "'\"" . ']+)\1/i',
        static function (array $match) use ($page_map): string {
            $file = snaimpianti_static_file_from_url($match[2]);
            if (!$file || !isset($page_map[$file])) {
                return $match[0];
            }

            $fragment = parse_url(html_entity_decode($match[2], ENT_QUOTES, 'UTF-8'), PHP_URL_FRAGMENT);
            $hash = $fragment ? '#' . $fragment : '';

            return 'href=' . $match[1] . esc_url($page_map[$file] . $hash) . $match[1];
        },
        $html
    ) ?? $html;

    return $html;
}

function snaimpianti_replace_restricted_customer_images(string $html): string
{
    $theme_uri = trailingslashit(get_template_directory_uri());
    $safe_images = [
        $theme_uri . 'assets/Immagini/Tubazioni%20SKID%20GAS%20Bonura/IMG_0253.jpg',
        $theme_uri . 'assets/Immagini/Tubazioni%20SKID%20GAS%20Bonura/IMG_20200610_113259.jpg',
        $theme_uri . 'assets/Immagini/Tubazioni%20SKID%20GAS%20Bonura/IMG_20200611_122548.jpg',
        $theme_uri . 'assets/Immagini/SKID%20LNG/f8efb232-3a4a-4cd5-9da9-2fb2d07b59f9.JPG',
        $theme_uri . 'assets/Immagini/Officina/IMG_20200527_093147.jpg',
        $theme_uri . 'assets/Immagini/Impianto%20OSMOSI%20CST/0561e4be-4d5e-4ff7-86e8-5ee9a2233119.jpg',
    ];

    $is_blocked = static function (string $value): bool {
        $value = html_entity_decode($value, ENT_QUOTES, 'UTF-8');
        for ($i = 0; $i < 3; $i++) {
            $decoded = rawurldecode($value);
            if ($decoded === $value) {
                break;
            }
            $value = $decoded;
        }

        $value = strtolower($value);

        return str_contains($value, 'skid o&g')
            || str_contains($value, 'tank olio')
            || str_contains($value, 'pignone');
    };

    $i = 0;
    $html = preg_replace_callback(
        '/\b(src|href|content|data-full)=(["\'])([^"\']+)\2/i',
        static function (array $match) use (&$i, $safe_images, $is_blocked): string {
            if (!$is_blocked($match[3])) {
                return $match[0];
            }

            $replacement = esc_url($safe_images[$i++ % count($safe_images)]);

            return $match[1] . '=' . $match[2] . $replacement . $match[2];
        },
        $html
    ) ?? $html;

    $j = 0;
    $html = preg_replace_callback(
        '#url\((["\']?)([^)"\']+)\1\)#i',
        static function (array $match) use (&$j, $safe_images, $is_blocked): string {
            if (!$is_blocked($match[2])) {
                return $match[0];
            }

            return 'url(' . $match[1] . esc_url($safe_images[$j++ % count($safe_images)]) . $match[1] . ')';
        },
        $html
    ) ?? $html;

    return $html;
}

function snaimpianti_apply_performance_hints(string $html): string
{
    $theme_uri = trailingslashit(get_template_directory_uri());
    $desktop_hero = esc_url($theme_uri . 'assets/Immagini/Officina/IMG_20200707_121840_001_COVER.jpg');
    $mobile_hero = esc_url($theme_uri . 'assets/optimized/hero-mobile.svg');

    if (stripos($html, '</head>') !== false && !str_contains($html, 'assets/optimized/hero-mobile.svg')) {
        $preload = '<link rel="preload" as="image" href="' . $mobile_hero . '" media="(max-width: 760px)" fetchpriority="high">' . "\n";
        $preload .= '<link rel="preload" as="image" href="' . $desktop_hero . '" media="(min-width: 761px)" fetchpriority="high">' . "\n";
        $html = str_ireplace('</head>', $preload . '</head>', $html);
    }

    $html = preg_replace_callback(
        '/<img\b[^>]*>/i',
        static function (array $match) use ($mobile_hero): string {
            $tag = $match[0];
            $lower = strtolower($tag);
            $is_hero = str_contains($lower, 'img_20200707_121840_001_cover');
            $has_dimensions = str_contains($lower, 'width=') && str_contains($lower, 'height=');

            if (!$is_hero && $has_dimensions) {
                return $tag;
            }

            $dimensions = null;
            if (str_contains($lower, 'logo.jpg')) {
                $dimensions = ' width="150" height="64"';
            } elseif ($is_hero) {
                $dimensions = ' width="1600" height="1067" sizes="100vw"';
                if (!str_contains($lower, 'fetchpriority=')) {
                    $tag = preg_replace('/<img\b/i', '<img fetchpriority="high"', $tag, 1) ?? $tag;
                }
                if (!str_contains($lower, 'loading=')) {
                    $tag = preg_replace('/<img\b/i', '<img loading="eager"', $tag, 1) ?? $tag;
                }
            } elseif (str_contains($lower, 'partners/')) {
                $dimensions = ' width="160" height="80"';
            } elseif (str_contains($lower, '/immagini/')) {
                $dimensions = ' width="900" height="650"';
            }

            if ($dimensions && !$has_dimensions) {
                $tag = preg_replace('/\s*\/?>$/', $dimensions . '$0', $tag, 1) ?? $tag;
            }

            if ($is_hero) {
                return '<picture class="hero-picture"><source media="(max-width: 760px)" srcset="' . esc_url($mobile_hero) . '" type="image/svg+xml">' . $tag . '</picture>';
            }

            return $tag;
        },
        $html
    ) ?? $html;

    return $html;
}

function snaimpianti_insert_wordpress_hooks(string $html): string
{
    ob_start();
    wp_head();
    $head = ob_get_clean();

    ob_start();
    wp_body_open();
    $body_open = ob_get_clean();

    ob_start();
    wp_footer();
    $footer = ob_get_clean();

    if (stripos($html, '</head>') !== false) {
        $html = str_ireplace('</head>', $head . "\n</head>", $html);
    }

    $html = preg_replace('/<body([^>]*)>/i', '<body$1>' . $body_open, $html, 1) ?? $html;

    if (stripos($html, '</body>') !== false) {
        $html = str_ireplace('</body>', $footer . "\n</body>", $html);
    }

    return $html;
}

function snaimpianti_render_static_html(string $static_file): void
{
    $static_file = sanitize_file_name($static_file);
    $path = get_theme_file_path('/' . $static_file);

    if (!file_exists($path)) {
        status_header(404);
        $path = get_theme_file_path('/index.html');
    }

    $html = file_get_contents($path);
    if ($html === false) {
        status_header(500);
        echo '<!doctype html><html><head><meta charset="utf-8"><title>S.N.A. Impianti</title></head><body><p>Template non disponibile.</p></body></html>';
        return;
    }

    $html = snaimpianti_rewrite_static_links($html);
    $html = snaimpianti_replace_restricted_customer_images($html);
    $html = snaimpianti_apply_performance_hints($html);
    $html = snaimpianti_insert_wordpress_hooks($html);

    echo $html;
}

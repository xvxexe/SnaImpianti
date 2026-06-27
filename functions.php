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

function snaimpianti_page_map(): array
{
    return [
        'index.html' => home_url('/'),
        'chi-siamo.html' => home_url('/chi-siamo/'),
        'presentazione-aziendale.html' => home_url('/presentazione-aziendale/'),
        'certificazioni.html' => home_url('/certificazioni/'),
        'ingegneria.html' => home_url('/ingegneria/'),
        'prodotti.html' => home_url('/prodotti/'),
        'galleria.html' => home_url('/galleria/'),
        'posizioni-aperte.html' => home_url('/posizioni-aperte/'),
        'contatti.html' => home_url('/contatti/'),
        'processi-saldatura-industriale.html' => home_url('/processi-saldatura-industriale/'),
    ];
}

function snaimpianti_rewrite_static_links(string $html): string
{
    $theme_uri = trailingslashit(get_template_directory_uri());
    $page_map = snaimpianti_page_map();

    $html = preg_replace(
        '#<link\b[^>]+href=["\'](?:\./)?(?:styles|partners)\.css(?:\?[^"\']*)?["\'][^>]*>\s*#i',
        '',
        $html
    ) ?? $html;

    $html = preg_replace(
        '#<script\b[^>]+src=["\'](?:\./)?script\.js(?:\?[^"\']*)?["\'][^>]*>\s*</script>\s*#i',
        '',
        $html
    ) ?? $html;

    $html = preg_replace_callback(
        '/\b(src|href|content|data-full)=([' . "'\"" . '])(assets\/[^' . "'\"" . ']+)\2/i',
        static function (array $match) use ($theme_uri): string {
            return $match[1] . '=' . $match[2] . esc_url($theme_uri . $match[3]) . $match[2];
        },
        $html
    ) ?? $html;

    $html = preg_replace_callback(
        '#url\((["\']?)(assets/[^)"\']+)\1\)#i',
        static function (array $match) use ($theme_uri): string {
            return 'url(' . $match[1] . esc_url($theme_uri . $match[2]) . $match[1] . ')';
        },
        $html
    ) ?? $html;

    $html = preg_replace_callback(
        '/\bhref=([' . "'\"" . '])([^' . "'\"" . ']+\.html(?:#[^' . "'\"" . ']*)?)\1/i',
        static function (array $match) use ($page_map): string {
            $href = html_entity_decode($match[2], ENT_QUOTES, 'UTF-8');
            $parts = explode('#', $href, 2);
            $file = $parts[0];
            $hash = isset($parts[1]) ? '#' . $parts[1] : '';

            if (!isset($page_map[$file])) {
                return $match[0];
            }

            return 'href=' . $match[1] . esc_url($page_map[$file] . $hash) . $match[1];
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
    $html = snaimpianti_insert_wordpress_hooks($html);

    echo $html;
}

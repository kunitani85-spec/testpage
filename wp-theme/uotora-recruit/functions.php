<?php
/**
 * uotora-recruit テーマ機能
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'UOTORA_VERSION', '1.0.0' );

/**
 * テーマセットアップ
 */
function uotora_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'custom-logo', array(
		'height'      => 60,
		'width'       => 200,
		'flex-height' => true,
		'flex-width'  => true,
	) );
	add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );

	register_nav_menus( array(
		'primary' => '主要ナビゲーション（ヘッダー）',
		'footer'  => 'フッターナビゲーション',
	) );

	set_post_thumbnail_size( 800, 800, true );
}
add_action( 'after_setup_theme', 'uotora_setup' );

/**
 * スタイル・スクリプトの読み込み
 */
function uotora_enqueue_assets() {
	wp_enqueue_style(
		'google-fonts',
		'https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700;900&display=swap',
		array(),
		null
	);
	wp_enqueue_style( 'uotora-style', get_stylesheet_uri(), array(), UOTORA_VERSION );
	wp_enqueue_script( 'uotora-script', get_template_directory_uri() . '/assets/js/script.js', array(), UOTORA_VERSION, true );

	// トップページのインタビュー・カルーセル用データをJSへ渡す
	if ( is_front_page() ) {
		$interviews = uotora_get_interview_summaries( 6 );
		wp_localize_script( 'uotora-script', 'UOTORA_INTERVIEWS', $interviews );
	}
}
add_action( 'wp_enqueue_scripts', 'uotora_enqueue_assets' );

/**
 * インタビュー一覧の簡易データ（カルーセル用）
 */
function uotora_get_interview_summaries( $count = 6 ) {
	$query = new WP_Query( array(
		'post_type'      => 'interview',
		'posts_per_page' => $count,
		'orderby'        => 'menu_order date',
		'order'          => 'ASC',
	) );

	$items = array();
	foreach ( $query->posts as $post ) {
		$items[] = array(
			'id'   => $post->post_name,
			'role' => get_post_meta( $post->ID, '_uotora_role', true ),
			'dept' => get_post_meta( $post->ID, '_uotora_dept', true ),
			'year' => get_post_meta( $post->ID, '_uotora_year', true ),
			'name' => get_the_title( $post ),
			'url'  => get_permalink( $post ),
			'photo'=> get_the_post_thumbnail_url( $post, 'medium' ),
		);
	}
	wp_reset_postdata();
	return $items;
}

/**
 * 社員インタビュー一覧ページの並び順を「並び替え（Order）」順にする
 */
function uotora_interview_archive_order( $query ) {
	if ( ! is_admin() && $query->is_main_query() && is_post_type_archive( 'interview' ) ) {
		$query->set( 'orderby', array( 'menu_order' => 'ASC', 'date' => 'ASC' ) );
		$query->set( 'posts_per_page', 30 );
	}
}
add_action( 'pre_get_posts', 'uotora_interview_archive_order' );

require get_template_directory() . '/inc/cpt.php';
require get_template_directory() . '/inc/meta-boxes.php';
require get_template_directory() . '/inc/customizer.php';

/**
 * ヘッダー・フッターのナビゲーションを既存デザインの
 * フラットな <a class="nav-link"> 構造で出力するためのWalker
 */
class Uotora_Nav_Walker extends Walker_Nav_Menu {
	public function start_el( &$output, $item, $depth = 0, $args = null, $id = 0 ) {
		$classes   = empty( $item->classes ) ? array() : (array) $item->classes;
		$classes[] = 'nav-link';
		$class_str = implode( ' ', array_filter( array_map( 'sanitize_html_class', $classes ) ) );

		$output .= sprintf(
			'<a href="%s" class="%s">%s</a>',
			esc_url( $item->url ),
			esc_attr( $class_str ),
			esc_html( $item->title )
		);
	}
	public function end_el( &$output, $item, $depth = 0, $args = null ) {}
}

/**
 * ヘッダーナビゲーションが未設定の場合のフォールバック
 */
function uotora_fallback_menu() {
	echo '<a href="' . esc_url( home_url( '/#message' ) ) . '" class="nav-link">会社紹介</a>';
	echo '<a href="' . esc_url( get_post_type_archive_link( 'interview' ) ) . '" class="nav-link">社員インタビュー</a>';
	echo '<a href="' . esc_url( home_url( '/#benefits' ) ) . '" class="nav-link">福利厚生</a>';
	echo '<a href="' . esc_url( home_url( '/#jobs' ) ) . '" class="nav-link">募集職種</a>';
	echo '<a href="' . esc_url( home_url( '/#contact' ) ) . '" class="nav-link nav-cta">エントリー</a>';
}

/**
 * 抜粋の長さ調整
 */
function uotora_excerpt_length( $length ) {
	return 40;
}
add_filter( 'excerpt_length', 'uotora_excerpt_length' );

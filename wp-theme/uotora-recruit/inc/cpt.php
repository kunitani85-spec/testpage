<?php
/**
 * カスタム投稿タイプ登録
 * - interview     : 社員インタビュー
 * - job_position   : 募集職種
 * - benefit        : 福利厚生タブ
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function uotora_register_post_types() {

	register_post_type( 'interview', array(
		'labels' => array(
			'name'               => '社員インタビュー',
			'singular_name'      => '社員インタビュー',
			'add_new_item'       => '新しいインタビューを追加',
			'edit_item'          => 'インタビューを編集',
			'all_items'          => 'インタビュー一覧',
			'featured_image'     => '社員の写真',
			'set_featured_image' => '写真を設定',
		),
		'public'       => true,
		'has_archive'  => true,
		'rewrite'      => array( 'slug' => 'interview' ),
		'menu_icon'    => 'dashicons-groups',
		'supports'     => array( 'title', 'thumbnail', 'page-attributes' ),
		'show_in_rest' => true,
	) );

	register_post_type( 'job_position', array(
		'labels' => array(
			'name'          => '募集職種',
			'singular_name' => '募集職種',
			'add_new_item'  => '新しい職種を追加',
			'edit_item'     => '職種を編集',
			'all_items'     => '募集職種一覧',
		),
		'public'       => true,
		'has_archive'  => false,
		'rewrite'      => array( 'slug' => 'job' ),
		'menu_icon'    => 'dashicons-businessman',
		'supports'     => array( 'title', 'editor', 'page-attributes' ),
		'show_in_rest' => true,
	) );

	register_post_type( 'benefit', array(
		'labels' => array(
			'name'          => '福利厚生タブ',
			'singular_name' => '福利厚生タブ',
			'add_new_item'  => '新しいタブを追加',
			'edit_item'     => 'タブを編集',
			'all_items'     => '福利厚生タブ一覧',
		),
		'public'       => true,
		'has_archive'  => false,
		'rewrite'      => array( 'slug' => 'benefit' ),
		'menu_icon'    => 'dashicons-star-filled',
		'supports'     => array( 'title', 'thumbnail', 'page-attributes' ),
		'show_in_rest' => true,
	) );
}
add_action( 'init', 'uotora_register_post_types' );

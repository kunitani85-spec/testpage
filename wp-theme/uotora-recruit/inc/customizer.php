<?php
/**
 * カスタマイザー設定
 * 外観 > カスタマイズ から、コードを触らずに編集できる項目
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function uotora_customize_register( $wp_customize ) {

	/* ---------- ヒーロー ---------- */
	$wp_customize->add_section( 'uotora_hero', array( 'title' => 'ヒーロー（トップ大見出し）', 'priority' => 30 ) );

	$hero_fields = array(
		'hero_tag'   => array( 'label' => 'タグ（英字）', 'default' => 'RECRUIT SITE' ),
		'hero_title_line1' => array( 'label' => '見出し 1行目', 'default' => "LET'S CREATE THE" ),
		'hero_title_mark'  => array( 'label' => '見出し 強調ワード', 'default' => 'FUTURE' ),
		'hero_title_line2' => array( 'label' => '見出し 続き', 'default' => ' TOGETHER!' ),
		'hero_desc'  => array( 'label' => '本文', 'default' => '私たちは、魚を通じて日本を元気にする会社です。仕入れから加工、販売、そして未来の食卓まで。「みんなの力」で、美しい海と豊かな食文化を次の世代へつないでいきませんか。', 'type' => 'textarea' ),
	);
	foreach ( $hero_fields as $id => $f ) {
		$wp_customize->add_setting( $id, array( 'default' => $f['default'], 'sanitize_callback' => 'sanitize_textarea_field' ) );
		$wp_customize->add_control( $id, array(
			'label'   => $f['label'],
			'section' => 'uotora_hero',
			'type'    => isset( $f['type'] ) && 'textarea' === $f['type'] ? 'textarea' : 'text',
		) );
	}

	/* ---------- ヒーロー写真（未設定時はイラスト風プレースホルダー） ---------- */
	$wp_customize->add_setting( 'hero_photo_1', array( 'default' => '', 'sanitize_callback' => 'esc_url_raw' ) );
	$wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'hero_photo_1', array(
		'label' => 'ヒーロー写真（大）', 'section' => 'uotora_hero',
	) ) );
	$wp_customize->add_setting( 'hero_photo_2', array( 'default' => '', 'sanitize_callback' => 'esc_url_raw' ) );
	$wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'hero_photo_2', array(
		'label' => 'ヒーロー写真（小）', 'section' => 'uotora_hero',
	) ) );

	/* ---------- 会社紹介セクション ---------- */
	$wp_customize->add_section( 'uotora_message', array( 'title' => '会社紹介セクション', 'priority' => 31 ) );
	$wp_customize->add_setting( 'message_title', array( 'default' => "みんなの力で、\n日本を元気に。", 'sanitize_callback' => 'sanitize_textarea_field' ) );
	$wp_customize->add_control( 'message_title', array( 'label' => '見出し（改行可）', 'section' => 'uotora_message', 'type' => 'textarea' ) );
	$wp_customize->add_setting( 'message_body', array(
		'default' => '私たちは、確かな目利きと丁寧な手仕事で、海の恵みを日本中の食卓へお届けしてきました。仕入れ・加工・販売、そしてお客様と向き合う一つひとつの仕事が、豊かな食文化を未来へつなぐ力になります。未来の子供たちへ、美しい海と豊かな食を。私たちと一緒に、その架け橋になりませんか。',
		'sanitize_callback' => 'sanitize_textarea_field',
	) );
	$wp_customize->add_control( 'message_body', array( 'label' => '本文', 'section' => 'uotora_message', 'type' => 'textarea' ) );
	$wp_customize->add_setting( 'message_photo', array( 'default' => '', 'sanitize_callback' => 'esc_url_raw' ) );
	$wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'message_photo', array(
		'label' => '会社紹介の写真', 'section' => 'uotora_message',
	) ) );

	/* ---------- 数字で見る魚寅 ---------- */
	$wp_customize->add_section( 'uotora_stats', array( 'title' => '数字で見る会社', 'priority' => 32 ) );
	$stats = array(
		'stat1_num' => array( 'label' => '数字1（例：350）', 'default' => '350' ),
		'stat1_suffix' => array( 'label' => '単位1（例：種+）', 'default' => '種+' ),
		'stat1_label' => array( 'label' => 'ラベル1', 'default' => '取扱魚種数' ),
		'stat2_num' => array( 'label' => '数字2', 'default' => '45' ),
		'stat2_suffix' => array( 'label' => '単位2', 'default' => '年' ),
		'stat2_label' => array( 'label' => 'ラベル2', 'default' => '創業からの歴史' ),
		'stat3_num' => array( 'label' => '数字3', 'default' => '12' ),
		'stat3_suffix' => array( 'label' => '単位3', 'default' => '拠点' ),
		'stat3_label' => array( 'label' => 'ラベル3', 'default' => '全国の拠点数' ),
		'stat4_num' => array( 'label' => '数字4', 'default' => '180' ),
		'stat4_suffix' => array( 'label' => '単位4', 'default' => '名' ),
		'stat4_label' => array( 'label' => 'ラベル4', 'default' => '従業員数' ),
	);
	foreach ( $stats as $id => $f ) {
		$wp_customize->add_setting( $id, array( 'default' => $f['default'], 'sanitize_callback' => 'sanitize_text_field' ) );
		$wp_customize->add_control( $id, array( 'label' => $f['label'], 'section' => 'uotora_stats', 'type' => 'text' ) );
	}

	/* ---------- 会社情報 ---------- */
	$wp_customize->add_section( 'uotora_company', array( 'title' => '会社情報（フッター）', 'priority' => 34 ) );
	$company = array(
		'company_name'     => array( 'label' => '会社名', 'default' => '株式会社 魚寅' ),
		'company_name_en'  => array( 'label' => '会社名（英字）', 'default' => 'UOTORA CO., LTD.' ),
		'company_address'  => array( 'label' => '所在地', 'default' => '〒000-0000 福岡県サンプル市サンプル町1-2-3' ),
		'company_tel'      => array( 'label' => 'TEL', 'default' => '000-000-0000（代表）' ),
		'company_rep'      => array( 'label' => '代表者', 'default' => '代表取締役　寅田 一郎' ),
		'company_business' => array( 'label' => '事業内容', 'default' => '水産物の仕入れ・加工・販売' ),
	);
	foreach ( $company as $id => $f ) {
		$wp_customize->add_setting( $id, array( 'default' => $f['default'], 'sanitize_callback' => 'sanitize_text_field' ) );
		$wp_customize->add_control( $id, array( 'label' => $f['label'], 'section' => 'uotora_company', 'type' => 'text' ) );
	}

	/* ---------- エントリー先メールアドレス ---------- */
	$wp_customize->add_section( 'uotora_contact', array( 'title' => 'エントリーボタンのリンク先', 'priority' => 36 ) );
	$wp_customize->add_setting( 'entry_url_new_grad', array( 'default' => '#', 'sanitize_callback' => 'esc_url_raw' ) );
	$wp_customize->add_control( 'entry_url_new_grad', array( 'label' => '新卒エントリーのURL', 'section' => 'uotora_contact', 'type' => 'url' ) );
	$wp_customize->add_setting( 'entry_url_career', array( 'default' => '#', 'sanitize_callback' => 'esc_url_raw' ) );
	$wp_customize->add_control( 'entry_url_career', array( 'label' => '中途エントリーのURL', 'section' => 'uotora_contact', 'type' => 'url' ) );
}
add_action( 'customize_register', 'uotora_customize_register' );

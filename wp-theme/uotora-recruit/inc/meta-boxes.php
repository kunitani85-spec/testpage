<?php
/**
 * 各カスタム投稿タイプの入力欄（メタボックス）
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* -------------------------------------------------
 * メタボックス登録
 * ------------------------------------------------- */
function uotora_add_meta_boxes() {
	add_meta_box( 'uotora_interview_box', 'インタビュー情報', 'uotora_render_interview_box', 'interview', 'normal', 'high' );
	add_meta_box( 'uotora_interview_qa_box', 'Q&A（最大4問）', 'uotora_render_interview_qa_box', 'interview', 'normal', 'default' );
	add_meta_box( 'uotora_interview_day_box', '1日の流れ（最大6項目）', 'uotora_render_interview_day_box', 'interview', 'normal', 'default' );

	add_meta_box( 'uotora_job_box', '求人情報', 'uotora_render_job_box', 'job_position', 'normal', 'high' );

	add_meta_box( 'uotora_benefit_box', 'タブ情報', 'uotora_render_benefit_box', 'benefit', 'normal', 'high' );
}
add_action( 'add_meta_boxes', 'uotora_add_meta_boxes' );

/* -------------------------------------------------
 * 表示用の小さなヘルパー
 * ------------------------------------------------- */
function uotora_field_row( $label, $name, $value, $type = 'text', $desc = '' ) {
	echo '<p style="margin:14px 0;">';
	echo '<label for="' . esc_attr( $name ) . '" style="display:block;font-weight:600;margin-bottom:6px;">' . esc_html( $label ) . '</label>';
	if ( 'textarea' === $type ) {
		echo '<textarea id="' . esc_attr( $name ) . '" name="' . esc_attr( $name ) . '" rows="4" style="width:100%;">' . esc_textarea( $value ) . '</textarea>';
	} else {
		echo '<input type="text" id="' . esc_attr( $name ) . '" name="' . esc_attr( $name ) . '" value="' . esc_attr( $value ) . '" style="width:100%;">';
	}
	if ( $desc ) {
		echo '<span class="description">' . esc_html( $desc ) . '</span>';
	}
	echo '</p>';
}

/* -------------------------------------------------
 * インタビュー：基本情報
 * ------------------------------------------------- */
function uotora_render_interview_box( $post ) {
	wp_nonce_field( 'uotora_save_interview', 'uotora_interview_nonce' );
	uotora_field_row( '役職（英語表記／バッジに表示）', '_uotora_role', get_post_meta( $post->ID, '_uotora_role', true ), 'text', '例：PRODUCT DIVISION MANAGER' );
	uotora_field_row( '部署・役職（日本語）', '_uotora_dept', get_post_meta( $post->ID, '_uotora_dept', true ), 'text', '例：商品部 商品部長' );
	uotora_field_row( '入社年', '_uotora_year', get_post_meta( $post->ID, '_uotora_year', true ), 'text', '例：2004年入社' );
	uotora_field_row( 'キャッチコピー', '_uotora_catch', get_post_meta( $post->ID, '_uotora_catch', true ), 'text', '例：売場は、お客様への手紙だ。' );
	uotora_field_row( 'リード文', '_uotora_lead', get_post_meta( $post->ID, '_uotora_lead', true ), 'textarea' );
	echo '<p class="description">社員の名前は投稿タイトルに、写真はアイキャッチ画像に設定してください。</p>';
}

function uotora_render_interview_qa_box( $post ) {
	for ( $i = 1; $i <= 4; $i++ ) {
		echo '<div style="border-top:1px solid #ddd;padding-top:10px;margin-top:10px;">';
		uotora_field_row( "Q{$i}", "_uotora_q{$i}", get_post_meta( $post->ID, "_uotora_q{$i}", true ) );
		uotora_field_row( "A{$i}", "_uotora_a{$i}", get_post_meta( $post->ID, "_uotora_a{$i}", true ), 'textarea' );
		echo '</div>';
	}
}

function uotora_render_interview_day_box( $post ) {
	echo '<p class="description">「明るく働きやすい会社」を伝える、1日のスケジュール紹介欄です。空欄の項目は表示されません。</p>';
	for ( $i = 1; $i <= 6; $i++ ) {
		echo '<div style="display:flex;gap:12px;margin:10px 0;align-items:flex-start;">';
		echo '<div style="width:120px;flex-shrink:0;">';
		uotora_field_row( "時刻 {$i}", "_uotora_day_time{$i}", get_post_meta( $post->ID, "_uotora_day_time{$i}", true ), 'text', '例：9:00' );
		echo '</div><div style="flex:1;">';
		uotora_field_row( "内容 {$i}", "_uotora_day_text{$i}", get_post_meta( $post->ID, "_uotora_day_text{$i}", true ), 'text', '例：出社・朝礼で今日の目標を共有' );
		echo '</div></div>';
	}
}

/* -------------------------------------------------
 * 募集職種
 * ------------------------------------------------- */
function uotora_render_job_box( $post ) {
	wp_nonce_field( 'uotora_save_job', 'uotora_job_nonce' );
	uotora_field_row( '雇用形態', '_uotora_job_type', get_post_meta( $post->ID, '_uotora_job_type', true ), 'text', '例：正社員 / 正社員・パート' );
	echo '<p class="description">職種名は投稿タイトルに、仕事内容の説明は本文（エディター）に入力してください。</p>';
}

/* -------------------------------------------------
 * 福利厚生タブ
 * ------------------------------------------------- */
function uotora_render_benefit_box( $post ) {
	wp_nonce_field( 'uotora_save_benefit', 'uotora_benefit_nonce' );
	uotora_field_row( 'サブタイトル', '_uotora_benefit_sub', get_post_meta( $post->ID, '_uotora_benefit_sub', true ), 'text', '例：未経験からでも安心して成長できる環境。' );

	$checklist = get_post_meta( $post->ID, '_uotora_benefit_checklist', true );
	uotora_field_row( 'チェックリスト（1行に1項目）', '_uotora_benefit_checklist', $checklist, 'textarea' );

	$icon    = get_post_meta( $post->ID, '_uotora_benefit_icon', true );
	$options = array(
		'cert'     => '資格・研修',
		'umbrella' => '休暇',
		'shield'   => '保険・保証',
		'family'   => '家族・育児',
		'coin'     => '退職金・給与',
	);
	echo '<p style="margin:14px 0;"><label style="display:block;font-weight:600;margin-bottom:6px;">アイコン</label>';
	echo '<select name="_uotora_benefit_icon">';
	foreach ( $options as $slug => $label ) {
		echo '<option value="' . esc_attr( $slug ) . '"' . selected( $icon, $slug, false ) . '>' . esc_html( $label ) . '</option>';
	}
	echo '</select></p>';
	echo '<p class="description">タブに表示される見出しは投稿タイトルに、写真はアイキャッチ画像に設定してください。表示順は「並び替え（メニュー順）」で調整できます。</p>';
}

/* -------------------------------------------------
 * 保存処理
 * ------------------------------------------------- */
function uotora_save_meta_boxes( $post_id ) {
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	$post_type = get_post_type( $post_id );

	if ( 'interview' === $post_type ) {
		if ( ! isset( $_POST['uotora_interview_nonce'] ) || ! wp_verify_nonce( $_POST['uotora_interview_nonce'], 'uotora_save_interview' ) ) {
			return;
		}
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		$text_fields = array( '_uotora_role', '_uotora_dept', '_uotora_year', '_uotora_catch' );
		foreach ( $text_fields as $field ) {
			if ( isset( $_POST[ $field ] ) ) {
				update_post_meta( $post_id, $field, sanitize_text_field( wp_unslash( $_POST[ $field ] ) ) );
			}
		}
		if ( isset( $_POST['_uotora_lead'] ) ) {
			update_post_meta( $post_id, '_uotora_lead', sanitize_textarea_field( wp_unslash( $_POST['_uotora_lead'] ) ) );
		}
		for ( $i = 1; $i <= 4; $i++ ) {
			if ( isset( $_POST[ "_uotora_q{$i}" ] ) ) {
				update_post_meta( $post_id, "_uotora_q{$i}", sanitize_text_field( wp_unslash( $_POST[ "_uotora_q{$i}" ] ) ) );
			}
			if ( isset( $_POST[ "_uotora_a{$i}" ] ) ) {
				update_post_meta( $post_id, "_uotora_a{$i}", sanitize_textarea_field( wp_unslash( $_POST[ "_uotora_a{$i}" ] ) ) );
			}
		}
		for ( $i = 1; $i <= 6; $i++ ) {
			if ( isset( $_POST[ "_uotora_day_time{$i}" ] ) ) {
				update_post_meta( $post_id, "_uotora_day_time{$i}", sanitize_text_field( wp_unslash( $_POST[ "_uotora_day_time{$i}" ] ) ) );
			}
			if ( isset( $_POST[ "_uotora_day_text{$i}" ] ) ) {
				update_post_meta( $post_id, "_uotora_day_text{$i}", sanitize_text_field( wp_unslash( $_POST[ "_uotora_day_text{$i}" ] ) ) );
			}
		}
	}

	if ( 'job_position' === $post_type ) {
		if ( ! isset( $_POST['uotora_job_nonce'] ) || ! wp_verify_nonce( $_POST['uotora_job_nonce'], 'uotora_save_job' ) ) {
			return;
		}
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}
		if ( isset( $_POST['_uotora_job_type'] ) ) {
			update_post_meta( $post_id, '_uotora_job_type', sanitize_text_field( wp_unslash( $_POST['_uotora_job_type'] ) ) );
		}
	}

	if ( 'benefit' === $post_type ) {
		if ( ! isset( $_POST['uotora_benefit_nonce'] ) || ! wp_verify_nonce( $_POST['uotora_benefit_nonce'], 'uotora_save_benefit' ) ) {
			return;
		}
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}
		if ( isset( $_POST['_uotora_benefit_sub'] ) ) {
			update_post_meta( $post_id, '_uotora_benefit_sub', sanitize_text_field( wp_unslash( $_POST['_uotora_benefit_sub'] ) ) );
		}
		if ( isset( $_POST['_uotora_benefit_checklist'] ) ) {
			update_post_meta( $post_id, '_uotora_benefit_checklist', sanitize_textarea_field( wp_unslash( $_POST['_uotora_benefit_checklist'] ) ) );
		}
		if ( isset( $_POST['_uotora_benefit_icon'] ) ) {
			update_post_meta( $post_id, '_uotora_benefit_icon', sanitize_key( wp_unslash( $_POST['_uotora_benefit_icon'] ) ) );
		}
	}
}
add_action( 'save_post', 'uotora_save_meta_boxes' );

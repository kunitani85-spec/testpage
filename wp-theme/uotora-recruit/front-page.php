<?php
/**
 * フロントページ（採用サイト トップ）
 */

get_header();

$hero_photo_1 = get_theme_mod( 'hero_photo_1', '' );
$hero_photo_2 = get_theme_mod( 'hero_photo_2', '' );
$message_photo = get_theme_mod( 'message_photo', '' );

$contact_status = isset( $_GET['uotora_contact'] ) ? sanitize_key( wp_unslash( $_GET['uotora_contact'] ) ) : '';
?>

<section class="hero" id="top">
	<div class="hero-waves" data-speed="0.25"></div>
	<div class="speed-lines"></div>
	<div class="hero-fish-swim" aria-hidden="true">
		<svg viewBox="0 0 48 48"><use href="#icon-fish"></use></svg>
	</div>
	<div class="hero-content">
		<div class="hero-text">
			<p class="hero-eyebrow reveal" data-anim="fade-up"><span><?php echo esc_html( get_theme_mod( 'hero_tag', 'RECRUIT SITE' ) ); ?></span></p>
			<h1 class="hero-title">
				<span class="reveal" data-anim="fade-up" data-delay="100"><?php echo esc_html( get_theme_mod( 'hero_title_line1', "LET'S CREATE THE" ) ); ?></span><br>
				<span class="mark reveal" data-anim="fade-up" data-delay="250"><?php echo esc_html( get_theme_mod( 'hero_title_mark', 'FUTURE' ) ); ?></span>
				<span class="reveal" data-anim="fade-up" data-delay="250"><?php echo esc_html( get_theme_mod( 'hero_title_line2', ' TOGETHER!' ) ); ?></span>
			</h1>
			<p class="hero-desc reveal" data-anim="fade-up" data-delay="400"><?php echo nl2br( esc_html( get_theme_mod( 'hero_desc', '' ) ) ); ?></p>
			<div class="hero-actions reveal" data-anim="fade-up" data-delay="550">
				<a href="#jobs" class="btn btn-primary btn-splash">募集職種を見る</a>
				<a href="#message" class="btn btn-ghost btn-splash">会社紹介を見る</a>
			</div>
		</div>
		<div class="hero-visual reveal" data-anim="fade-in" data-delay="300">
			<div class="hero-photo-cluster">
				<div class="ph-photo hero-photo-1" <?php echo $hero_photo_1 ? 'style="background-image:url(' . esc_url( $hero_photo_1 ) . ');background-size:cover;background-position:center;"' : ''; ?>>
					<?php if ( ! $hero_photo_1 ) : ?><svg viewBox="0 0 48 48"><use href="#icon-fish"></use></svg><?php endif; ?>
				</div>
				<div class="ph-photo hero-photo-2" <?php echo $hero_photo_2 ? 'style="background-image:url(' . esc_url( $hero_photo_2 ) . ');background-size:cover;background-position:center;"' : ''; ?>>
					<?php if ( ! $hero_photo_2 ) : ?><svg viewBox="0 0 48 48"><use href="#icon-boat"></use></svg><?php endif; ?>
				</div>
			</div>
		</div>
	</div>
	<div class="scroll-indicator reveal" data-anim="fade-in" data-delay="900">
		<span class="scroll-line"></span>
		<span class="scroll-text">SCROLL</span>
	</div>
</section>

<section class="message" id="message">
	<div class="section-inner message-grid">
		<div class="message-photo reveal" data-anim="fade-in" <?php echo $message_photo ? 'style="background-image:url(' . esc_url( $message_photo ) . ');background-size:cover;background-position:center;"' : ''; ?>>
			<?php if ( ! $message_photo ) : ?>
			<div class="ph-photo" style="position:relative;width:100%;height:100%;background:linear-gradient(150deg,#2c4d74,#0b1830);">
				<svg viewBox="0 0 48 48"><use href="#icon-net"></use></svg>
			</div>
			<?php endif; ?>
		</div>
		<div class="message-text">
			<p class="section-tag on-light reveal" data-anim="fade-up"><span>MESSAGE</span></p>
			<h2 class="section-title reveal" data-anim="fade-up" data-delay="100"><?php echo nl2br( esc_html( get_theme_mod( 'message_title', '' ) ) ); ?></h2>
			<p class="message-body reveal" data-anim="fade-up" data-delay="200"><?php echo nl2br( esc_html( get_theme_mod( 'message_body', '' ) ) ); ?></p>
		</div>
	</div>
</section>

<section class="triptych">
	<div class="triptych-grid">
		<div class="triptych-item reveal" data-anim="fade-up" data-delay="0" style="background:linear-gradient(150deg,#1a3454,#060d1a);">
			<span class="ph-label"><svg viewBox="0 0 48 48"><use href="#icon-box"></use></svg>仕入れ・目利き</span>
		</div>
		<div class="triptych-item reveal" data-anim="fade-up" data-delay="120" style="background:linear-gradient(150deg,#2c4d74,#0b1830);">
			<span class="ph-label"><svg viewBox="0 0 48 48"><use href="#icon-net"></use></svg>加工・品質管理</span>
		</div>
		<div class="triptych-item reveal" data-anim="fade-up" data-delay="240" style="background:linear-gradient(150deg,#4a6f97,#112742);">
			<span class="ph-label"><svg viewBox="0 0 48 48"><use href="#icon-truck"></use></svg>営業・販売</span>
		</div>
	</div>
</section>

<section class="stats-section">
	<div class="stats">
		<?php for ( $i = 1; $i <= 4; $i++ ) : ?>
		<div class="stat-item reveal" data-anim="fade-up" data-delay="<?php echo esc_attr( ( $i - 1 ) * 100 ); ?>">
			<span class="stat-num" data-count="<?php echo esc_attr( get_theme_mod( "stat{$i}_num", '0' ) ); ?>">0</span><span class="stat-suffix"><?php echo esc_html( get_theme_mod( "stat{$i}_suffix", '' ) ); ?></span>
			<p class="stat-label"><?php echo esc_html( get_theme_mod( "stat{$i}_label", '' ) ); ?></p>
		</div>
		<?php endfor; ?>
	</div>
</section>

<section class="interview" id="interview">
	<div class="section-banner">
		<p class="section-banner-en">INTERVIEW</p>
		<p class="section-banner-jp">社員インタビュー</p>
	</div>
	<div class="section-inner">
		<div class="interview-track" id="interviewTrack">
			<?php
			$interview_query = new WP_Query( array(
				'post_type'      => 'interview',
				'posts_per_page' => 3,
				'orderby'        => 'menu_order date',
				'order'          => 'ASC',
			) );
			if ( $interview_query->have_posts() ) :
				while ( $interview_query->have_posts() ) :
					$interview_query->the_post();
					?>
					<a href="<?php the_permalink(); ?>" class="interview-card">
						<div class="interview-photo">
							<?php if ( has_post_thumbnail() ) : ?>
								<?php the_post_thumbnail( 'medium' ); ?>
							<?php else : ?>
								<svg viewBox="0 0 48 48"><use href="#icon-person"></use></svg>
							<?php endif; ?>
						</div>
						<div class="interview-body">
							<p class="interview-role"><?php echo esc_html( get_post_meta( get_the_ID(), '_uotora_role', true ) ); ?></p>
							<p class="interview-name"><?php the_title(); ?></p>
							<p class="interview-year"><?php echo esc_html( get_post_meta( get_the_ID(), '_uotora_year', true ) ); ?></p>
						</div>
					</a>
					<?php
				endwhile;
				wp_reset_postdata();
			else :
				?>
				<p>まだインタビューが登録されていません。管理画面の「社員インタビュー」から追加してください。</p>
				<?php
			endif;
			?>
		</div>
		<div class="interview-nav">
			<button class="interview-arrow" id="interviewPrev" aria-label="前へ">
				<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
			</button>
			<button class="interview-arrow" id="interviewNext" aria-label="次へ">
				<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
			</button>
		</div>
		<div class="interview-cta">
			<a href="<?php echo esc_url( get_post_type_archive_link( 'interview' ) ); ?>" class="btn btn-outline-navy btn-splash">インタビュー一覧を見る</a>
		</div>
	</div>
</section>

<section class="benefits" id="benefits">
	<div class="section-banner">
		<p class="section-banner-en">EMPLOYEE BENEFITS</p>
		<p class="section-banner-jp">福利厚生</p>
	</div>
	<div class="benefits-inner">
		<?php
		$benefit_query = new WP_Query( array(
			'post_type'      => 'benefit',
			'posts_per_page' => -1,
			'orderby'        => 'menu_order',
			'order'          => 'ASC',
		) );
		if ( $benefit_query->have_posts() ) :
			$benefit_posts = $benefit_query->posts;
			?>
			<div class="tab-bar" id="tabBar">
				<?php foreach ( $benefit_posts as $index => $b ) : ?>
					<button class="tab-btn<?php echo 0 === $index ? ' is-active' : ''; ?>" data-tab="tab<?php echo esc_attr( $b->ID ); ?>"><?php echo esc_html( get_the_title( $b ) ); ?></button>
				<?php endforeach; ?>
			</div>
			<div class="tab-panels" id="tabPanels">
				<?php foreach ( $benefit_posts as $index => $b ) :
					$sub       = get_post_meta( $b->ID, '_uotora_benefit_sub', true );
					$checklist = get_post_meta( $b->ID, '_uotora_benefit_checklist', true );
					$icon      = get_post_meta( $b->ID, '_uotora_benefit_icon', true );
					$icon      = $icon ? $icon : 'cert';
					$items     = array_filter( array_map( 'trim', explode( "\n", (string) $checklist ) ) );
					?>
					<div class="tab-panel<?php echo 0 === $index ? ' is-active' : ''; ?>" id="tab<?php echo esc_attr( $b->ID ); ?>">
						<div>
							<h3><?php echo esc_html( get_the_title( $b ) ); ?></h3>
							<?php if ( $sub ) : ?><p class="tab-sub"><?php echo esc_html( $sub ); ?></p><?php endif; ?>
							<ul class="tab-checklist">
								<?php foreach ( $items as $item ) : ?>
									<li><svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg><?php echo esc_html( $item ); ?></li>
								<?php endforeach; ?>
							</ul>
						</div>
						<div class="tab-photo">
							<?php if ( has_post_thumbnail( $b ) ) : ?>
								<?php echo get_the_post_thumbnail( $b, 'medium' ); ?>
							<?php else : ?>
								<svg viewBox="0 0 48 48"><use href="#icon-<?php echo esc_attr( $icon ); ?>"></use></svg>
							<?php endif; ?>
						</div>
					</div>
				<?php endforeach; ?>
			</div>
			<?php
			wp_reset_postdata();
		else :
			?>
			<p style="color:#fff;">福利厚生タブが登録されていません。管理画面の「福利厚生タブ」から追加してください。</p>
			<?php
		endif;
		?>

		<div class="support-banner reveal" data-anim="fade-up">安心して働けるサポート制度も充実</div>

		<div class="support-icons">
			<div class="support-icon-item reveal" data-anim="fade-up" data-delay="0">
				<svg viewBox="0 0 48 48"><use href="#icon-umbrella"></use></svg>
				<span>年間休日<br>120日</span>
			</div>
			<div class="support-icon-item reveal" data-anim="fade-up" data-delay="80">
				<svg viewBox="0 0 48 48"><use href="#icon-shield"></use></svg>
				<span>各種社会保険<br>完備</span>
			</div>
			<div class="support-icon-item reveal" data-anim="fade-up" data-delay="160">
				<svg viewBox="0 0 48 48"><use href="#icon-family"></use></svg>
				<span>産休・育休取得<br>サポート</span>
			</div>
			<div class="support-icon-item reveal" data-anim="fade-up" data-delay="240">
				<svg viewBox="0 0 48 48"><use href="#icon-coin"></use></svg>
				<span>退職金制度<br>あり</span>
			</div>
			<div class="support-icon-item reveal" data-anim="fade-up" data-delay="320">
				<svg viewBox="0 0 48 48"><use href="#icon-cert"></use></svg>
				<span>資格取得支援<br>制度あり</span>
			</div>
		</div>

		<div class="benefits-cta">
			<a href="#jobs" class="btn btn-primary btn-splash">詳しく見る</a>
		</div>
	</div>
</section>

<section class="cta-band">
	<a href="#jobs" style="display:block;">
		<div class="cta-band-inner">
			<p class="cta-band-en">RECRUIT</p>
			<p class="cta-band-jp">募集職種</p>
			<div class="cta-circle">CHECK</div>
		</div>
	</a>
</section>

<section class="jobs" id="jobs">
	<div class="section-inner">
		<p class="section-tag on-light reveal" data-anim="fade-up"><span>RECRUIT</span></p>
		<h2 class="section-title reveal" data-anim="fade-up" data-delay="100">募集職種</h2>
	</div>
	<div class="section-inner jobs-grid">
		<?php
		$job_query = new WP_Query( array(
			'post_type'      => 'job_position',
			'posts_per_page' => -1,
			'orderby'        => 'menu_order date',
			'order'          => 'ASC',
		) );
		if ( $job_query->have_posts() ) :
			$i = 0;
			while ( $job_query->have_posts() ) :
				$job_query->the_post();
				$job_type = get_post_meta( get_the_ID(), '_uotora_job_type', true );
				?>
				<a href="#contact" class="job-card reveal" data-anim="fade-up" data-delay="<?php echo esc_attr( $i * 80 ); ?>">
					<div>
						<?php if ( $job_type ) : ?><span class="job-type"><?php echo esc_html( $job_type ); ?></span><?php endif; ?>
						<h3><?php the_title(); ?></h3>
						<p><?php echo esc_html( wp_trim_words( get_the_content(), 40, '…' ) ); ?></p>
					</div>
					<span class="job-arrow"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
				</a>
				<?php
				$i++;
			endwhile;
			wp_reset_postdata();
		else :
			?>
			<p>募集職種が登録されていません。管理画面の「募集職種」から追加してください。</p>
			<?php
		endif;
		?>
	</div>
</section>

<section class="contact" id="contact">
	<div class="section-inner">
		<p class="section-tag on-light reveal" data-anim="fade-up"><span>ENTRY</span></p>
		<h2 class="section-title reveal" data-anim="fade-up" data-delay="100">エントリー・お問い合わせ</h2>
		<p class="contact-desc reveal" data-anim="fade-up" data-delay="200">
			ご応募・ご質問など、お気軽にご連絡ください。担当者より折り返しご連絡いたします。
		</p>

		<form class="contact-form reveal" data-anim="fade-up" data-delay="300" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
			<input type="hidden" name="action" value="uotora_contact">
			<?php wp_referer_field(); ?>
			<?php wp_nonce_field( 'uotora_contact', 'uotora_contact_nonce' ); ?>
			<div class="form-row">
				<label>
					<span>お名前<em>必須</em></span>
					<input type="text" name="name" required placeholder="山田 太郎">
				</label>
				<label>
					<span>メールアドレス<em>必須</em></span>
					<input type="email" name="email" required placeholder="example@mail.com">
				</label>
			</div>
			<label>
				<span>電話番号</span>
				<input type="tel" name="tel" placeholder="000-0000-0000">
			</label>
			<label>
				<span>ご希望の職種</span>
				<input type="text" name="job" placeholder="例：鮮魚仕入れ・バイヤー">
			</label>
			<label>
				<span>お問い合わせ内容<em>必須</em></span>
				<textarea name="message" rows="5" required placeholder="ご質問やご経歴などをご記入ください"></textarea>
			</label>
			<button type="submit" class="btn btn-primary btn-block btn-splash">送信する</button>
			<p class="form-note">
				<?php
				if ( 'success' === $contact_status ) {
					echo 'お問い合わせありがとうございます。担当者より折り返しご連絡いたします。';
				} elseif ( 'error' === $contact_status ) {
					echo '必須項目が未入力です。もう一度ご確認ください。';
				}
				?>
			</p>
		</form>
	</div>
</section>

<?php get_footer(); ?>

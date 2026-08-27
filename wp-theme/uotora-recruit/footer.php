<footer class="site-footer">
	<div class="footer-inner">
		<div class="footer-top">
			<div>
				<p class="footer-logo"><?php echo esc_html( get_theme_mod( 'company_name', '株式会社 魚寅' ) ); ?></p>
				<p class="footer-logo-sub"><?php echo esc_html( get_theme_mod( 'company_name_en', 'UOTORA CO., LTD.' ) ); ?></p>
			</div>
			<div class="footer-info">
				<dl>
					<dt>所在地</dt><dd><?php echo esc_html( get_theme_mod( 'company_address', '' ) ); ?></dd>
					<dt>TEL</dt><dd><?php echo esc_html( get_theme_mod( 'company_tel', '' ) ); ?></dd>
					<dt>代表者</dt><dd><?php echo esc_html( get_theme_mod( 'company_rep', '' ) ); ?></dd>
					<dt>事業内容</dt><dd><?php echo esc_html( get_theme_mod( 'company_business', '' ) ); ?></dd>
				</dl>
			</div>
		</div>
		<div class="footer-cols" style="margin-top:36px;">
			<div class="footer-col">
				<h4>採用情報</h4>
				<a href="<?php echo esc_url( home_url( '/#message' ) ); ?>">会社紹介</a>
				<a href="<?php echo esc_url( get_post_type_archive_link( 'interview' ) ); ?>">社員インタビュー</a>
				<a href="<?php echo esc_url( home_url( '/#benefits' ) ); ?>">福利厚生</a>
			</div>
			<div class="footer-col">
				<h4>エントリー</h4>
				<a href="<?php echo esc_url( home_url( '/#jobs' ) ); ?>">募集職種</a>
				<a href="<?php echo esc_url( home_url( '/#contact' ) ); ?>">お問い合わせ</a>
			</div>
			<div class="footer-col">
				<h4>会社情報</h4>
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>">TOPページ</a>
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>">会社概要</a>
			</div>
		</div>
		<p class="footer-copy">&copy; <?php echo esc_html( date_i18n( 'Y' ) ); ?> <?php echo esc_html( get_theme_mod( 'company_name', '株式会社 魚寅' ) ); ?>. All Rights Reserved.</p>
	</div>
</footer>

<button class="to-top" id="toTop" aria-label="トップへ戻る">
	<svg viewBox="0 0 24 24"><path d="M12 4l-8 8h5v8h6v-8h5z"/></svg>
</button>

<?php get_template_part( 'template-parts/icons' ); ?>

<?php wp_footer(); ?>
</body>
</html>

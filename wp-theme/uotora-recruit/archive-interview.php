<?php
/**
 * 社員インタビュー 一覧ページ
 */

get_header();
?>

<section class="section-banner">
	<p class="section-banner-en">INTERVIEW</p>
	<p class="section-banner-jp">社員インタビュー一覧</p>
</section>

<section class="interview-list">
	<div class="section-inner">
		<p class="list-lead reveal" data-anim="fade-up">
			商品部・店舗・商品管理部・仕入れ・グローバル部・マーケティング部・水産企画部。
			それぞれの立場で働く社員に、仕事のやりがいや魚寅で働く魅力を聞きました。
		</p>
		<div class="interview-list-grid">
			<?php
			if ( have_posts() ) :
				$i = 0;
				while ( have_posts() ) :
					the_post();
					?>
					<a href="<?php the_permalink(); ?>" class="interview-card reveal" data-anim="fade-up" data-delay="<?php echo esc_attr( ( $i % 3 ) * 100 ); ?>">
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
							<?php $catch = get_post_meta( get_the_ID(), '_uotora_catch', true ); ?>
							<?php if ( $catch ) : ?><p class="interview-excerpt"><?php echo esc_html( $catch ); ?></p><?php endif; ?>
						</div>
					</a>
					<?php
					$i++;
				endwhile;
			else :
				?>
				<p>まだインタビューが登録されていません。管理画面の「社員インタビュー」から追加してください。</p>
				<?php
			endif;
			?>
		</div>
	</div>
</section>

<?php
wp_reset_postdata();
get_footer();

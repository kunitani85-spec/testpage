<?php
/**
 * 汎用フォールバックテンプレート
 */

get_header();
?>
<section class="interview-detail">
	<div class="section-inner">
		<?php if ( have_posts() ) : ?>
			<?php while ( have_posts() ) : the_post(); ?>
				<article <?php post_class(); ?>>
					<h1 class="detail-name"><?php the_title(); ?></h1>
					<div class="detail-lead"><?php the_content(); ?></div>
				</article>
			<?php endwhile; ?>
		<?php else : ?>
			<p>コンテンツが見つかりませんでした。</p>
		<?php endif; ?>
	</div>
</section>
<?php
get_footer();

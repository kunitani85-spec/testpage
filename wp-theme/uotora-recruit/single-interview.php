<?php
/**
 * 社員インタビュー 詳細ページ
 */

get_header();

while ( have_posts() ) :
	the_post();

	$post_id = get_the_ID();
	$role    = get_post_meta( $post_id, '_uotora_role', true );
	$dept    = get_post_meta( $post_id, '_uotora_dept', true );
	$year    = get_post_meta( $post_id, '_uotora_year', true );
	$catch   = get_post_meta( $post_id, '_uotora_catch', true );
	$lead    = get_post_meta( $post_id, '_uotora_lead', true );

	$dept_year = trim( $dept . ( $dept && $year ? ' / ' : '' ) . $year );

	$prev_post = get_adjacent_post( false, '', true, 'category' );
	$next_post = get_adjacent_post( false, '', false, 'category' );
	?>

	<section class="section-banner">
		<p class="section-banner-en">INTERVIEW</p>
		<p class="section-banner-jp">社員インタビュー</p>
	</section>

	<section class="interview-detail">
		<div class="section-inner">
			<a href="<?php echo esc_url( get_post_type_archive_link( 'interview' ) ); ?>" class="detail-back reveal" data-anim="fade-up">
				<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
				インタビュー一覧へ戻る
			</a>

			<div class="detail-head reveal" data-anim="fade-up" data-delay="100">
				<div class="detail-photo">
					<?php if ( has_post_thumbnail() ) : ?>
						<?php the_post_thumbnail( 'medium' ); ?>
					<?php else : ?>
						<svg viewBox="0 0 48 48"><use href="#icon-person"></use></svg>
					<?php endif; ?>
				</div>
				<div>
					<?php if ( $role ) : ?><p class="detail-role"><span><?php echo esc_html( $role ); ?></span></p><?php endif; ?>
					<h1 class="detail-name"><?php the_title(); ?></h1>
					<?php if ( $dept_year ) : ?><p class="detail-dept"><?php echo esc_html( $dept_year ); ?></p><?php endif; ?>
					<?php if ( $catch ) : ?><p class="detail-catch">「<?php echo esc_html( $catch ); ?>」</p><?php endif; ?>
				</div>
			</div>

			<?php if ( $lead ) : ?>
				<p class="detail-lead reveal" data-anim="fade-up" data-delay="150"><?php echo nl2br( esc_html( $lead ) ); ?></p>
			<?php endif; ?>

			<?php
			// 1日の流れ
			$day_items = array();
			for ( $i = 1; $i <= 6; $i++ ) {
				$time = get_post_meta( $post_id, "_uotora_day_time{$i}", true );
				$text = get_post_meta( $post_id, "_uotora_day_text{$i}", true );
				if ( $time || $text ) {
					$day_items[] = array( 'time' => $time, 'text' => $text );
				}
			}
			if ( ! empty( $day_items ) ) :
				?>
				<div class="day-flow reveal" data-anim="fade-up">
					<p class="day-flow-title">
						<svg viewBox="0 0 24 24" class="day-flow-icon"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
						ある1日のスケジュール
					</p>
					<div class="day-flow-list">
						<?php foreach ( $day_items as $i => $item ) : ?>
							<div class="day-flow-item reveal" data-anim="fade-up" data-delay="<?php echo esc_attr( $i * 70 ); ?>">
								<span class="day-flow-time"><?php echo esc_html( $item['time'] ); ?></span>
								<span class="day-flow-dot"></span>
								<span class="day-flow-text"><?php echo esc_html( $item['text'] ); ?></span>
							</div>
						<?php endforeach; ?>
					</div>
				</div>
				<?php
			endif;
			?>

			<div class="detail-qa">
				<?php
				$qi = 0;
				for ( $i = 1; $i <= 4; $i++ ) :
					$q = get_post_meta( $post_id, "_uotora_q{$i}", true );
					$a = get_post_meta( $post_id, "_uotora_a{$i}", true );
					if ( ! $q && ! $a ) {
						continue;
					}
					?>
					<div class="qa-item reveal" data-anim="fade-up" data-delay="<?php echo esc_attr( $qi * 80 ); ?>">
						<?php if ( $q ) : ?><p class="qa-q"><?php echo esc_html( $q ); ?></p><?php endif; ?>
						<?php if ( $a ) : ?><p class="qa-a"><?php echo nl2br( esc_html( $a ) ); ?></p><?php endif; ?>
					</div>
					<?php
					$qi++;
				endfor;
				?>
			</div>

			<div class="detail-nav reveal" data-anim="fade-up">
				<?php if ( $prev_post ) : ?>
					<a href="<?php echo esc_url( get_permalink( $prev_post ) ); ?>" class="btn btn-outline-navy btn-sm">← <?php echo esc_html( get_the_title( $prev_post ) ); ?></a>
				<?php else : ?>
					<span></span>
				<?php endif; ?>
				<a href="<?php echo esc_url( get_post_type_archive_link( 'interview' ) ); ?>" class="btn btn-outline-navy btn-sm">一覧へ戻る</a>
				<?php if ( $next_post ) : ?>
					<a href="<?php echo esc_url( get_permalink( $next_post ) ); ?>" class="btn btn-outline-navy btn-sm"><?php echo esc_html( get_the_title( $next_post ) ); ?> →</a>
				<?php else : ?>
					<span></span>
				<?php endif; ?>
			</div>
		</div>
	</section>

	<?php
endwhile;

get_footer();

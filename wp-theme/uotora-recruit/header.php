<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div class="preloader" id="preloader">
	<div class="preloader-logo">魚寅<span>UOTORA RECRUIT</span></div>
	<div class="preloader-bar"><span></span></div>
</div>

<div class="cursor-glow" id="cursorGlow"></div>

<header class="site-header" id="siteHeader">
	<div class="header-inner">
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="logo">
			<?php if ( has_custom_logo() ) : ?>
				<?php the_custom_logo(); ?>
			<?php else : ?>
				<span class="logo-mark">魚寅</span>
			<?php endif; ?>
			<span class="logo-badge">RECRUIT</span>
		</a>
		<nav class="main-nav" id="mainNav">
			<?php
			wp_nav_menu( array(
				'theme_location' => 'primary',
				'container'      => false,
				'items_wrap'     => '%3$s',
				'link_before'    => '',
				'depth'          => 1,
				'walker'         => new Uotora_Nav_Walker(),
				'fallback_cb'    => 'uotora_fallback_menu',
			) );
			?>
		</nav>
		<button class="nav-toggle" id="navToggle" aria-label="メニュー">
			<span></span><span></span><span></span>
		</button>
	</div>
</header>

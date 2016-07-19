<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              http://horo.wc5.org
 * @since             1.0.0
 * @package           Mktest1
 *
 * @wordpress-plugin
 * Plugin Name:       MkGalaxy Test 1
 * Plugin URI:        http://mkgalaxy.com
 * Description:       My Sample Plugin. 
 * Version:           1.0.0
 * Author:            Manish Khanchandani
 * Author URI:        http://horo.wc5.org
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       mktest1
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-mktest1-activator.php
 */
function activate_mktest1() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-mktest1-activator.php';
	Mktest1_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-mktest1-deactivator.php
 */
function deactivate_mktest1() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-mktest1-deactivator.php';
	Mktest1_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_mktest1' );
register_deactivation_hook( __FILE__, 'deactivate_mktest1' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-mktest1.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_mktest1() {

	$plugin = new Mktest1();
	$plugin->run();

}
run_mktest1();

import React from 'react';
import styles from './About.module.scss';

export const About = () => {
	return (
		<main className={styles.About}>
			<h1>Memorize Scripture</h1>
			<nav>
				<h2>Table of Contents</h2>
				<ol>
					<li>
						<a href='#introduction'>Introduction</a>
					</li>
					<li>
						<a href='#instructions'>Instructions</a>
					</li>
					<li>
						<a href='#how-it-works'>How It Works</a>
					</li>
					<li>
						<a href='#review'>Review</a>
					</li>
					<li>
						<a href='#resources'>More Resources</a>
					</li>
					<li>
						<a href='#contributing'>Contributing</a>
					</li>
				</ol>
			</nav>
			<article>
				<h2 id='#introduction'>Introduction</h2>
				<p>Content...</p>
			</article>
			<article>
				<h2 id='#instructions'>Instructions</h2>
				<p>Content...</p>
			</article>
			<article>
				<h2 id='#how-it-works'>How It Works</h2>
				<p>Content...</p>
			</article>
			<article>
				<h2 id='#review'>Review</h2>
				<p>Content...</p>
			</article>
			<article>
				<h2 id='#resources'>More Resources</h2>
				<p>Content...</p>
			</article>
			<article>
				<h2 id='#contributing'>Contributing</h2>
				<p>Content...</p>
			</article>
		</main>
	);
};

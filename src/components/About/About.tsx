import React from 'react';
import styles from './About.module.scss';

import { ScrollLink } from './ScrollLink';

import { animateScroll as scroll } from 'react-scroll';

export const About = () => {
	const scrollToTop = () => scroll.scrollToTop();

	return (
		<article className={styles.About}>
			<h1>Memorize Scripture</h1>
			<nav>
				<ol>
					<li>
						<ScrollLink to='introduction'>Introduction</ScrollLink>
					</li>
					<li>
						<ScrollLink to='instructions'>Instructions</ScrollLink>
					</li>
					<li>
						<ScrollLink to='how-it-works'>How It Works</ScrollLink>
					</li>
					<li>
						<ScrollLink to='how-to-review'>How To Review</ScrollLink>
					</li>
					<li>
						<ScrollLink to='more-resources'>More Resources</ScrollLink>
					</li>
					<li>
						<ScrollLink to='contributing'>Contributing</ScrollLink>
					</li>
				</ol>
			</nav>

			<section>
				<h2 id='introduction'>Introduction</h2>
				<p>Content...</p>
			</section>
			<section>
				<h2 id='instructions'>Instructions</h2>
				<p>Content...</p>
			</section>
			<section>
				<h2 id='how-it-works'>How It Works</h2>
				<p>Content...</p>
			</section>
			<section>
				<h2 id='how-to-review'>How To Review</h2>
				<p>Content...</p>
			</section>
			<section>
				<h2 id='more-resources'>More Resources</h2>
				<p>Content...</p>
			</section>
			<section>
				<h2 id='contributing'>Contributing</h2>
				<p>Content...</p>
			</section>
			<button onClick={scrollToTop}>Back to Top</button>
		</article>
	);
};

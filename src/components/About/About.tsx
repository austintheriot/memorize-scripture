import React from 'react';
import styles from './About.module.scss';

//animated scroll library
import { animateScroll as scroll } from 'react-scroll';

//custom components
import { ScrollLink } from './ScrollLink';
import { Paragraph } from './Paragraph';

//Custom icons
import beginningIcon from '../../icons/beginning.svg';
import rewindIcon from '../../icons/rewind.svg';
import playIcon from '../../icons/play.svg';
import pauseIcon from '../../icons/pause.svg';
import forwardIcon from '../../icons/forward.svg';
import loadingIcon from '../../icons/loading.svg';
import errorIcon from '../../icons/error.svg';
import flipIcon from '../../icons/flip.svg';

export const About = () => {
	const scrollToTop = () => scroll.scrollToTop();

	return (
		<article className={styles.About}>
			<h1>How to Memorize Scripture</h1>
			<nav className={styles.tableOfContents}>
				<ul>
					<li>
						<ScrollLink to='intro'>Intro</ScrollLink>
					</li>
					<li>
						<ScrollLink to='app-controls'>App Controls</ScrollLink>
					</li>
					<li>
						<ScrollLink to='how-to-memorize'>How to Memorize</ScrollLink>
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
				</ul>
			</nav>

			<section id='intro'>
				<h2>Intro</h2>
				<Paragraph>
					The art of memory has been a fascination of mine for a long time. Over
					the years, I've practiced memorizing poems, numbers, quotes, words,
					names, songs, trivia, hymns, and texts from the Bible. Out of all the
					things I've memorized, however, extended memorization of the Bible in
					particular has proven to me to be one of the greatest personal
					treasures. To carry God's Word in my heart and to have it on my mind
					at any hour of the day or night is an incredible blessing.
					Additionally, I firmly believe it's of enormous benefit to the
					Christian to memorize large portions of Scripture{' '}
					<em>in its context</em>, without the distraction of verse numbers and
					footnotes, appreciating the ebb and flow of the book and its
					arguments.
				</Paragraph>

				<Paragraph>
					But let's face it: memorization, for the vast majority of people,
					isn't enjoyable. More often than not, it's a laborious process, filled
					with frustration and failure rather than success. For this reason,
					many people give up when trying to memorize Bible verses or stop after
					they've learned only a verse or two. But I don't think it has to be
					this way. Most people have just never learned how to learn.
				</Paragraph>

				<Paragraph>
					I first stumbled on the idea of condensing a text to memorize it via{' '}
					<a href='http://www.productivity501.com/how-to-memorize-verbatim-text/294/'>
						this article
					</a>{' '}
					by Mark Shead. After finding the article, I began implementing the
					process in my own Bible memorization, and I have personally found the
					process to be so much more quick and painless ever since. And that's
					my end goal for this app: to facilitate the extended memorization of
					God's Word. This same technique is also used by a few other scripture
					memory softwares (<a href='https://www.memverse.com/'>memverse.com</a>{' '}
					for example), but I hope to offer a more mobile-friendly, streamlined
					app here, one that is focused on extended memorization, rather than
					collections of shorter verses.
				</Paragraph>

				<Paragraph>
					This app has been created with the permission of the creators of the{' '}
					<a href='https://www.esv.org/'>English Standard Bible (ESV)</a>, from
					which all Bible quotes are drawn, unless otherwise indicated.
				</Paragraph>
			</section>
			<section id='app-controls'>
				<h2>App Controls</h2>
				<p>
					Tip: You may click on any condensed line in the app to quickly reveal
					the full text.
				</p>
				<p>
					<button
						disabled={true}
						className={['button', styles.appControls].join(' ')}>
						<img
							src={flipIcon}
							alt={'example button: flip text view'}
							className={styles.icon}
						/>
					</button>{' '}
					Flip between condensed text and full text views.
				</p>
				<p>
					<button
						disabled={true}
						className={['button', styles.appControls].join(' ')}>
						<img
							src={beginningIcon}
							alt={'example button: go to beginning'}
							className={styles.icon}
						/>
					</button>{' '}
					Skip to beggining in audio.
				</p>
				<p>
					<button
						disabled={true}
						className={['button', styles.appControls].join(' ')}>
						<img
							src={rewindIcon}
							alt={'example button: back 5 seconds'}
							className={styles.icon}
						/>
					</button>{' '}
					Rewind 5 seconds.
				</p>
				<p>
					<button
						disabled={true}
						className={['button', styles.appControls].join(' ')}>
						<img
							src={playIcon}
							alt={'example button: play audio'}
							className={styles.icon}
						/>
					</button>{' '}
					Play audio.
				</p>
				<p>
					<button
						disabled={true}
						className={['button', styles.appControls].join(' ')}>
						<img
							src={pauseIcon}
							alt={'example button: pause audio'}
							className={styles.icon}
						/>
					</button>{' '}
					Pause audio.
				</p>
				<p>
					<button
						disabled={true}
						className={['button', styles.appControls].join(' ')}>
						<img
							src={loadingIcon}
							alt={'example button: audio loading'}
							className={styles.icon}
						/>
					</button>{' '}
					Audio is loading
				</p>
				<p>
					<button
						disabled={true}
						className={['button', styles.appControls].join(' ')}>
						<img
							src={errorIcon}
							alt={'example button: audio error'}
							className={styles.icon}
						/>
					</button>{' '}
					Error loading audio.
				</p>
				<p>
					<button
						disabled={true}
						className={['button', styles.appControls].join(' ')}>
						<img
							src={forwardIcon}
							alt={'example button: forward 5s'}
							className={styles.icon}
						/>
					</button>{' '}
					Fast-forward audio 5 seconds.
				</p>
			</section>
			<section id='how-to-memorize'>
				<h2>How to Memorize</h2>
				<p>
					If you've never tried to memorize an extended passage of scripture
					before, or have only ever memorized a verse or two at a time, start
					with a short Psalm that you like.
				</p>
				<p>
					In this example, we'll practice by suing using Psalm 117, but feel
					free to use whatever text you prefer:
				</p>
				<blockquote>
					<p>Praise the LORD, all nations!</p>
					<Paragraph>Extol him, all peoples!</Paragraph>
					<p>For great is his steadfast love toward us,</p>
					<Paragraph>
						and the faithfulness of the LORD endures forever.
					</Paragraph>
					<p>Praise the LORD!</p>
				</blockquote>
				<p>
					If we condense the text down to only the first letters of each word
					and surrounding punctuation we get:
				</p>
				<blockquote>
					<p>PtL,an!</p>
					<p>Eh,ap!</p>
					<p>Fgihsltu,</p>
					<p>atfotLef.</p>
					<p>PtL!</p>
				</blockquote>

				<p>
					Here is how to memorize it (and really any chapter from the Bible):
				</p>
				<div className={styles.olWrapper}>
					<ol>
						<li>
							Speak the entire (original) text out loud a few times, or listen
							to the audio version of the text a few times. Do this until you
							feel like you have a strong sense of the overall meaning of the
							passage as a whole.
						</li>
						<li>
							Look up any unfamiliar words or the meaning of particular verses
							that you don't understand. It's vital to understand what you
							memorize and not simply mindlessly cram it into your brain!
						</li>
						<li>Start with the first line. There are two primary methods:</li>
						<ul>
							<li>
								Look only at the condensed text while you listen to the audio
								version of the text. Focus on line at a time. Listen to the line
								and try to speak it as you listen. If you get it wrong, rewind
								the audio and try again. Do this until you can speak the line
								perfectly while looking at the condensed text.
							</li>
							<li>
								The second method is to flip back and forth between the
								condensed text and the original text. Practice speaking the
								original text while looking at the condensed text only. If you
								can't remember the line, refer back to the original text. Do
								this until you can speak the line perfectly while looking only
								at the condensed text.
							</li>
						</ul>
						<li>
							Complete this process for line 1 only. Move onto line 2, and focus
							on it alone. Once you can speak line 2, practice speaking both
							line 1 and line 2 together while looking only at the condensed
							text. Once this is comfortable, move onto line 3 and practice it
							alone until it's comfortable. Then practice speaking line 1, 2,
							and 3 together. Continue this process for the entire passage. I
							call this the pyramid method of learning, because you're gradually
							building up from a base of text you know well, moving into less
							familiar text. The pattern ends up looking something like this:
						</li>
					</ol>
				</div>
				<blockquote>
					<p>1</p>
					<p>12</p>
					<p>123</p>
					<p>12345</p>
					<p>123456</p>
					<p>1234567 etc.</p>
				</blockquote>
				<Paragraph>
					You will find that once you can speak the entire passage by looking
					only at the condensed text, you already have most of the passage
					memorized. All that's left to do is practice speaking the text without
					looking at the letters at all. (Hint: you can then memorize the text
					without looking by following the same pyramid pattern of repetition).
				</Paragraph>
			</section>
			<section id='how-it-works'>
				<h2>How It Works</h2>
				<Paragraph>
					This process works well for most people because of a psychological
					principle called{' '}
					<a href='https://en.wikipedia.org/wiki/Chunking_(psychology)'>
						"chunking"
					</a>
					, in which individual pieces of information are grouped together into
					a collected whole. Chunking helps us remember more than we normally
					would be able to if we were trying to remember the same information as
					individual pieces. This is why we tend to group long numbers into 3
					groups of 3 or 4, such as phone numbers: "(012) 345-6789" rather than
					"0123456789." The principle also applies when memorizing a text:
					reducing a passage down to its first letters allows us to "chunk" a
					text in groups of phrases, sentences, and verses rather than as
					individual words.
				</Paragraph>
			</section>
			<section id='how-to-review'>
				<h2>How To Review</h2>
				<Paragraph>
					Once the text is memorized, it's important to regularly review what we
					have learned. I always begin my study sessions with review before
					learning any new material. If pressed for time, it's far better to
					retain the words you've already worked so hard to learn than to learn
					new passages. One of the most efficient ways that I have found to
					review passages is by reviewing individual chapters of a book at a{' '}
					time. I recommend using a spaced repetition flash card system, such as
					<a href='https://apps.ankiweb.net/'>Anki</a>, although it's also
					possible implement this type of system with pen-and-paper flashcards
					instead. A spaced repetition flash card system allows us to review a
					text right before we might normally forget it. Over time, the review
					intervals become longer and longer, allowing us to solidify a text in
					our long term memory while minimizing the burden of review time
					(because let's face it: there's only so much time in the day!).
				</Paragraph>
			</section>
			<section id='more-resources'>
				<h2>More Resources</h2>
				<Paragraph>Coming Soon...</Paragraph>
			</section>
			<section id='contributing'>
				<h2>Contributing</h2>
				<Paragraph>
					I hope you find this app to be of benefit in your own faith walk. If
					you are interested in contributing to this project, have questions,
					comments, suggestions, bug reports, or if you're just interested in
					chatting, please don't hesitate to contact me via my{' '}
					<a href='https://austintheriot.com/contact'>website</a>,{' '}
					<a href='https://www.linkedin.com/in/austinmtheriot/'>LinkedIn</a>, or
					by{' '}
					<a href='mailto:austinmtheriot@gmail.com?subject=Scripture Memorization App'>
						emailing me directly
					</a>
					.
				</Paragraph>
				<Paragraph>
					This project was made with love and is offered free of charge. If
					you'd like to contribute code to this project or if you would like to
					donate towards website upkeep costs, please contact me (see above).{' '}
				</Paragraph>
				<Paragraph>
					Lastly, this developer is looking for a job. If you are hiring Front
					End Developers, please feel free to get in touch!
				</Paragraph>
			</section>
			<div className={styles.copyright}>
				<p>Originally published October 22, 2020.</p>
				<p>
					{'Copyright '}&#169;
					{` ${new Date().getFullYear()}, Austin Theriot.`}
				</p>
				<p>All rights reserved.</p>
			</div>
			<button
				onClick={scrollToTop}
				className={['button', styles.button].join(' ')}>
				Back to Top
			</button>
		</article>
	);
};

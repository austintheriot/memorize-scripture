import React, { useEffect, useContext } from 'react';
import styles from './About.module.scss';
import { FirebaseContext } from '../../app/firebaseContext';
import { Link } from 'react-router-dom';

//animated scroll library
import { animateScroll as scroll } from 'react-scroll';

//custom components
import { ErrorBoundary } from '../../components/ErrorBoundary/ErrorBoundary';
import { ScrollLink } from '../../components/Links/ScrollLink';
import { ExternalLink } from '../../components/Links/ExternalLink';

//Custom icons
import beginningIcon from '../../icons/beginning.svg';
import rewindIcon from '../../icons/rewind.svg';
import playIcon from '../../icons/play.svg';
import pauseIcon from '../../icons/pause.svg';
import forwardIcon from '../../icons/forward.svg';
import loadingIcon from '../../icons/loading.svg';
import errorIcon from '../../icons/error.svg';
import flipIcon from '../../icons/flip.svg';
import { Footer } from '../../components/Footer/Footer';

export default () => {
	const { analytics } = useContext(FirebaseContext);
	const scrollToTop = () => {
		scroll.scrollToTop({ smooth: true, duration: 500 });
		analytics.logEvent('back_to_top_button_pressed');
	};

	const handleNavLinkClick = (link: string) => {
		analytics.logEvent('table_of_contents_link_clicked', {
			link,
		});
	};

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	let listItemCounter = 1;

	return (
		<ErrorBoundary>
			<article className={styles.About}>
				<h1>How to Memorize Scripture</h1>
				<nav className={styles.tableOfContents}>
					<ul>
						<li className={styles.tableOfContentsLI}>
							<ScrollLink to='intro' onClick={handleNavLinkClick}>
								Intro
							</ScrollLink>
						</li>
						<li className={styles.tableOfContentsLI}>
							<ScrollLink to='app-controls' onClick={handleNavLinkClick}>
								App Controls
							</ScrollLink>
						</li>
						<li className={styles.tableOfContentsLI}>
							<ScrollLink to='app-installation' onClick={handleNavLinkClick}>
								App Installation
							</ScrollLink>
						</li>
						<li className={styles.tableOfContentsLI}>
							<ScrollLink to='how-to-memorize' onClick={handleNavLinkClick}>
								How to Memorize
							</ScrollLink>
						</li>
						<li className={styles.tableOfContentsLI}>
							<ScrollLink
								to='how-this-technique-works'
								onClick={handleNavLinkClick}>
								How This Technique Works
							</ScrollLink>
						</li>
						<li className={styles.tableOfContentsLI}>
							<ScrollLink to='how-to-review' onClick={handleNavLinkClick}>
								How To Review
							</ScrollLink>
						</li>
						<li className={styles.tableOfContentsLI}>
							<ScrollLink to='more-resources' onClick={handleNavLinkClick}>
								More Resources
							</ScrollLink>
						</li>
						<li className={styles.tableOfContentsLI}>
							<ScrollLink to='contact' onClick={handleNavLinkClick}>
								Contact
							</ScrollLink>
						</li>
					</ul>
				</nav>

				<button
					onClick={scrollToTop}
					className={['button', styles.button].join(' ')}>
					Back to Top
				</button>

				<section id='intro'>
					<h2>Intro</h2>
					<p>
						The art of memory has been a fascination of mine for a long time.
						Over the years, I've practiced memorizing many different kinds of
						information, but extended memorization of the Bible in particular
						has proven to me to be one of the greatest personal treasures. To
						carry God's Word in my heart and to have it on my mind at any hour
						of the day or night is an incredible blessing. Additionally, I
						firmly believe it's of enormous benefit to the Christian to memorize
						large portions of Scripture at a time, <em>in its context</em>,
						without the distraction of verse numbers and footnotes, appreciating
						the ebb and flow of a psalm, chapter, or even a book and its
						contents.
					</p>

					<p>
						But let's face it: memorization, for the vast majority of people,
						isn't enjoyable. More often than not, it's a laborious process,
						filled with frustration and failure rather than success. For this
						reason, many people give up when trying to memorize Bible verses or
						stop after they've learned only a verse or two. But I don't think it
						has to be this way. Most people have just never learned <em>how</em>{' '}
						to learn.
					</p>

					<p>
						I first stumbled on the idea of condensing a text to memorize it via{' '}
						<ExternalLink to='http://www.productivity501.com/how-to-memorize-verbatim-text/294/'>
							this article
						</ExternalLink>{' '}
						by Mark Shead. After finding the article, I began implementing the
						process in my own Bible memorization, and I have personally found
						the process to be so much more quick and painless ever since then.
						And that's my end goal for this app: to facilitate the extended
						memorization of God's Word. This same technique is also used by a
						few other scripture memory softwares (
						<ExternalLink to='https://www.memverse.com/'>
							memverse.com
						</ExternalLink>{' '}
						for example), but I hope to offer a more mobile-friendly,
						streamlined app here, one that is focused on extended memorization,
						rather than collections of shorter verses.
					</p>

					<p>
						This app has been created with the permission of the creators of the{' '}
						<ExternalLink to='https://www.esv.org/'>
							English Standard Bible (ESV)
						</ExternalLink>
						, from which all Bible quotes are drawn, unless otherwise indicated.
					</p>
				</section>

				<section id='app-controls'>
					<h2>App Controls</h2>
					<p>
						Here's quick rundown of the various buttons you can find on the{' '}
						<Link to='/'>Learn</Link> page of the app.
					</p>
					<div className={styles.tipWrapper}>
						<p>
							Tip: You may click on any condensed line on the{' '}
							<Link to='/'>Learn</Link> page of the app to quickly reveal the
							full text.
						</p>
					</div>
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
						Skip to beginning in audio.
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
						Rewind audio 5 seconds.
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
					<p>
						Lastly, you can tap anywhere along the blue audio indicator to skip
						to a particular position in the audio.
					</p>
				</section>

				<section id='app-installation'>
					<h2>App Installation</h2>
					<p>
						By default, this app is available for offline use by visiting{' '}
						<ExternalLink to='https://memorizescripture.org/'>
							https://memorizescripture.org/
						</ExternalLink>{' '}
						in your browser, even without an internet connection (as long as
						you've visited the page once in the last year). Your last 5 most
						recently accessed chapters are automatically saved and are available
						for viewing anywhere and anytime.
					</p>
					<p>
						For a more app-like experience on mobile devices and some desktop
						devices, you can add this website to your home screen. This creates
						an icon for the website, and when you open the webpage by tapping on
						it, the app will open in standalone mode (no address bar or
						navigation menu getting in the way), like a native app. See below
						for instructions.
					</p>
					<p className={styles.miniHeading}>Android Users:</p>
					<p>
						Launch Chrome for Android and open{' '}
						<ExternalLink to='https://memorizescripture.org/'>
							https://memorizescripture.org/
						</ExternalLink>
						. Tap the menu button and tap Add to Home Screen. You’ll be able to
						enter a name for the shortcut and then Chrome will add it to your
						home screen.
					</p>
					<p className={styles.miniHeading}>iPhone, iPad, &amp; iPod Users:</p>
					<p>
						Launch Safari and go to{' '}
						<ExternalLink to='https://memorizescripture.org/'>
							https://memorizescripture.org/
						</ExternalLink>
						. Tap the Share button on the browser’s toolbar (the rectangle with
						upward-pointing arrow). This can be found on the bar at the top of
						the screen on an iPad, and on the bar at the bottom of the screen on
						an iPhone or iPod Touch. Tap "Add to Home Screen". You'll be able to
						name the shortcut, and then Safari will add the shortcut to your
						home screen.
					</p>
					<p className={styles.miniHeading}>Desktop:</p>
					<p>
						When opened with Google Chrome, this app can be installed to the
						desktop by clicking the "install" button at the top of the window to
						the right of the address bar. If you don't see the word "install",
						you might see a small plus sign instead.
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
						In this example, we'll practice by using Psalm 117, but feel free to
						use whatever text you prefer:
					</p>
					<blockquote>
						<p>Praise the LORD, all nations!</p>
						<p className={styles.indent}>Extol him, all peoples!</p>
						<p>For great is his steadfast love toward us,</p>
						<p className={styles.indent}>
							and the faithfulness of the LORD endures forever.
						</p>
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
							<li value={listItemCounter}>
								Speak the entire (original) text out loud a few times, or listen
								to the audio version of the text a few times. Do this until you
								feel like you have a strong sense of the overall meaning of the
								passage as a whole.
							</li>
							<li value={++listItemCounter}>
								Look up any unfamiliar words or the meaning of particular verses
								that you don't understand. It's vital to understand what you
								memorize and not just mindlessly cram it into your brain!
							</li>
							<li value={++listItemCounter}>
								Start with the first line. There are two primary methods:
							</li>
							<li
								style={{
									listStyle: 'none',
								}}>
								<ul>
									<li>
										Look only at the condensed text while you listen to the
										audio version of the text. Focus on line at a time. Listen
										to the line and try to speak it as you listen. If you get it
										wrong, rewind the audio and try again. Do this until you can
										speak the line perfectly while looking at the condensed
										text.
									</li>
									<li>
										The second method is to flip back and forth between the
										condensed text and the original text. Practice speaking the
										original text while looking at the condensed text only. If
										you can't remember the line, refer back to the original
										text. Do this until you can speak the line perfectly while
										looking only at the condensed text.
									</li>
								</ul>
							</li>
							<li value={++listItemCounter}>
								Complete this process for line 1 only. Move onto line 2, and
								focus on it alone. Once you can speak line 2, practice speaking
								both line 1 and line 2 together while looking only at the
								condensed text. Once this is comfortable, move onto line 3 and
								practice it alone until it's comfortable. Then practice speaking
								line 1, 2, and 3 together. Continue this process for the entire
								passage. I call this the pyramid method of learning, because
								you're gradually building up from a base of text you know well,
								moving into less familiar text. The pattern ends up looking
								something like this:
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
					<p>
						You will find that once you can speak the entire passage by looking
						only at the condensed text, you already have most of the passage
						memorized. All that's left to do is practice speaking the text
						without looking at the letters at all. (Hint: you can then memorize
						the text without looking by following the same pyramid pattern of
						repetition).
					</p>
				</section>
				<section id='how-this-technique-works'>
					<h2>How This Technique Works</h2>
					<p>
						This process works well for most people because of a psychological
						principle called{' '}
						<ExternalLink to='https://en.wikipedia.org/wiki/Chunking_(psychology)'>
							"chunking"
						</ExternalLink>
						, in which individual pieces of information are grouped together
						into a collected whole. Chunking helps us remember more than we
						normally would be able to if we were trying to remember the same
						information as individual pieces. This is why we tend to group long
						numbers into 3 groups of 3 or 4, such as phone numbers: "(012)
						345-6789" rather than "0123456789." The principle also applies when
						memorizing a text: reducing a passage down to its first letters
						allows us to "chunk" a text in groups of phrases, sentences, and
						verses rather than as individual words.
					</p>
				</section>
				<section id='how-to-review'>
					<h2>How To Review</h2>
					<p>
						Once the text is memorized, it's important to regularly review what
						you have learned. I always begin my study sessions with review
						before learning any new material. If pressed for time, it's far
						better to retain the words you've already worked so hard to learn
						than to learn new passages.
					</p>
					<p>
						On the <Link to='/review'>Review Page</Link>, you can test your
						knowledge of a passage by typing it into the Input box. The tester
						only grades the letters you type, ignoring punctuation,
						capitalization, line breaks, and spaces. This is so that you can
						more easily test yourself by using your phone's speech-to-text
						feature, if available. Most mobile phones should allow you to use
						this feature to speak the passage while your phone transcribes the
						text into the input box, instead of having to manually type the
						passage.
					</p>
					<p>
						An alternative is to simply record yourself speaking the passage
						from memory. Then listen to the recording and check that you've
						spoken it accurately by looking at the original text. I hope to add
						this feature to the app as a built-in option in the near feature.
					</p>
					<p>
						I typically review individual chapters of a book at a time with the
						audio method, which takes around 5-10 minutes per day. Additionally,
						whenever I'm driving, I often practice reciting an entire book
						(without looking at the app) or I recite along with an audio bible
						to ensure I'm not making any mistakes.{' '}
						<em>Please don't try to use this app while driving!</em>
					</p>
					<p>
						One of the most efficient ways that I have found to time my reviews
						is by using a spaced repetition flash card system, such as{' '}
						<ExternalLink to='https://apps.ankiweb.net/'>Anki</ExternalLink> to
						remind me when a passage is due for review. Although it's possible
						to implement this type of system with pen-and-paper flashcards, Anki
						saves <em>a lot</em> of time in the long run, especially when
						creating flashcards is as simple as copying and pasting from the
						internet. A spaced repetition flash card system allows you to review
						a text right before you might normally forget it. Over time, the
						review intervals become longer and longer, allowing you to solidify
						a text in your long term memory while minimizing the burden of
						review time (because let's face it: there's only so much time in the
						day!).
					</p>
				</section>
				<section id='more-resources'>
					<h2>More Resources</h2>
					<p>Coming Soon...</p>
				</section>
				<section id='contact'>
					<h2>Contact</h2>
					<p>
						I hope you find this app to be a blessing in your faith life. If you
						are interested in contributing to this project, have questions,
						comments, suggestions, bug reports, or if you're just interested in
						chatting, please don't hesitate to contact me via the{' '}
						<Link to='/contact'>Contact</Link> page on this website, and I'll
						get back to you shortly. Additionally, I can be reached via my{' '}
						<ExternalLink to='https://austintheriot.com/contact'>
							website
						</ExternalLink>
						,{' '}
						<ExternalLink to='https://www.linkedin.com/in/austinmtheriot/'>
							LinkedIn
						</ExternalLink>
						, or by{' '}
						<ExternalLink to='mailto:austinmtheriot@gmail.com?subject=Scripture Memorization App'>
							emailing me directly
						</ExternalLink>
						.
					</p>
					<p>
						Checkout out the{' '}
						<ExternalLink to='https://github.com/austintheriot/memorize-scripture'>
							GitHub repository
						</ExternalLink>{' '}
						for this project.
					</p>
					<p>
						This project was made with love and is offered free of charge. If
						you'd like to contribute code to this project or if you would like
						to donate towards website upkeep costs, please contact me (see
						above).{' '}
					</p>
					<p>
						Lastly, this developer is looking for a job. If you are hiring Front
						End Developers, please feel free to get in touch!
					</p>
				</section>
				<section className={styles.copyright}>
					<p>Originally published October 22, 2020.</p>
					<p>Last updated November 9, 2020.</p>
					<p>
						{'Copyright '}&#169;
						{` ${new Date().getFullYear()}, Austin Theriot.`}
					</p>
					<p>All rights reserved.</p>
				</section>
				<Footer />
			</article>
		</ErrorBoundary>
	);
};

import React from 'react';
import styles from './About.module.scss';
import { animateScroll as scroll } from 'react-scroll';
import { ErrorBoundary } from '../../components/ErrorBoundary/ErrorBoundary';
import { ScrollLink } from '../../components/Links/ScrollLink';
import { ExternalLink } from '../../components/Links/ExternalLink';
import beginningIcon from 'icons/beginning.svg';
import rewindIcon from 'icons/rewind.svg';
import playIcon from 'icons/play.svg';
import pauseIcon from 'icons/pause.svg';
import forwardIcon from 'icons/forward.svg';
import loadingIcon from 'icons/loading.svg';
import errorIcon from 'icons/error.svg';
import flipIcon from 'icons/flip.svg';
import { Footer } from '../../components/Footer/Footer';
import { useFirebaseContext } from 'hooks/useFirebaseContext';
import FocusRing from 'components/FocusRing/FocusRing';
import { InternalLink } from 'components/Links/InternalLink';
import RecordingButton from 'images/record.png';
import StopRecordingButton from 'images/stop-recording.png';
import DeleteRecordingButton from 'images/delete-recording.png';

export const About = () => {
	const { analytics } = useFirebaseContext();
	const scrollToTop = () => {
		scroll.scrollToTop({ smooth: true, duration: 500 });
		analytics.logEvent('back_to_top_button_pressed');
	};

	const handleNavLinkClick = (link: string) => {
		analytics.logEvent('table_of_contents_link_clicked', {
			link,
		});
	};

	let listItemCounter = 1;

	return (
		<ErrorBoundary>
			<article className={styles.About}>
				<h1>How to Memorize Scripture</h1>
				<nav className={styles.tableOfContents}>
					<ul>
						<li className={styles.tableOfContentsLI}>
							<ScrollLink to="intro" onClick={handleNavLinkClick}>
								Intro
							</ScrollLink>
						</li>
						<li className={styles.tableOfContentsLI}>
							<ScrollLink to="app-controls" onClick={handleNavLinkClick}>
								App Controls
							</ScrollLink>
						</li>
						<li className={styles.tableOfContentsLI}>
							<ScrollLink to="how-to-memorize" onClick={handleNavLinkClick}>
								How to Memorize
							</ScrollLink>
						</li>
						<li className={styles.tableOfContentsLI}>
							<ScrollLink
								to="how-this-technique-works"
								onClick={handleNavLinkClick}
							>
								How This Technique Works
							</ScrollLink>
						</li>
						<li className={styles.tableOfContentsLI}>
							<ScrollLink to="how-to-review" onClick={handleNavLinkClick}>
								How To Review
							</ScrollLink>
						</li>
						<li className={styles.tableOfContentsLI}>
							<ScrollLink to="contact" onClick={handleNavLinkClick}>
								Contact
							</ScrollLink>
						</li>
					</ul>
				</nav>

				<button
					onClick={scrollToTop}
					className={['button', styles.button].join(' ')}
				>
					Back to Top
					<FocusRing />
				</button>

				<section id="intro">
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
						<ExternalLink to="http://www.productivity501.com/how-to-memorize-verbatim-text/294/">
							this article
						</ExternalLink>{' '}
						by Mark Shead. After finding the article, I began implementing the
						process in my own Bible memorization, and I have personally found
						the process to be so much more quick and painless ever since then.
						And that's my end goal for this app: to facilitate the extended
						memorization of God's Word. This same technique is also used by a
						few other scripture memory softwares (
						<ExternalLink to="https://www.memverse.com/">
							memverse.com
						</ExternalLink>{' '}
						for example), but I hope to offer a more mobile-friendly,
						streamlined app here, one that is focused on extended memorization,
						rather than collections of shorter verses.
					</p>

					<p>
						This app has been created with the permission of the creators of the{' '}
						<ExternalLink to="https://www.esv.org/">
							English Standard Bible (ESV)
						</ExternalLink>
						, from which all Bible quotes are drawn, unless otherwise indicated.
					</p>
				</section>

				<section id="app-controls">
					<h2>App Controls</h2>
					<p>
						Here's quick rundown of the various buttons you can find on the{' '}
						<InternalLink to="/">Memorize</InternalLink> page of the app.
					</p>
					<div className={styles.tipWrapper}>
						<p>
							Tip: You may click on any condensed line on the{' '}
							<InternalLink to="/">Memorize</InternalLink> page of the app to
							quickly reveal the full text.
						</p>
					</div>
					<p>
						<button
							disabled={true}
							className={['button', styles.appControls].join(' ')}
						>
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
							className={['button', styles.appControls].join(' ')}
						>
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
							className={['button', styles.appControls].join(' ')}
						>
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
							className={['button', styles.appControls].join(' ')}
						>
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
							className={['button', styles.appControls].join(' ')}
						>
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
							className={['button', styles.appControls].join(' ')}
						>
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
							className={['button', styles.appControls].join(' ')}
						>
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
							className={['button', styles.appControls].join(' ')}
						>
							<img
								src={forwardIcon}
								alt={'example button: forward 5s'}
								className={styles.icon}
							/>
						</button>{' '}
						Fast-forward audio 5 seconds.
					</p>
					<p>
						You may record yourself by clicking the recording button{' '}
						<img
							src={RecordingButton}
							alt="recording button"
							className={styles.RecordingButtonImages}
						/>
						. Stop recording by pressing the stop recording button{' '}
						<img
							src={StopRecordingButton}
							alt="stop recording button"
							className={styles.RecordingButtonImages}
						/>
						. You can then listen to yourself and check your recitation accuracy
						by using the same play/pause controls that you see above. Once
						you're done, press the{' '}
						<img
							src={DeleteRecordingButton}
							alt="delete recording button"
							className={styles.RecordingButtonImages}
						/>{' '}
						button to delete your recording and return to listening to the Bible
						audio.
					</p>
					<p>
						Note: this website will <strong>never</strong> save, transmit, or
						otherwise store or share your recorded audio data.
					</p>
					<p>
						Lastly, you can tap anywhere along the blue audio indicator to skip
						to a particular position in the audio.
					</p>
				</section>

				<section id="how-to-memorize">
					<h2>How to Memorize</h2>
					<p>
						First, I want to mention that there are very few "rules" about memorizing.
						People learn best in many different ways, and whatever is effective for you
						and faithful to God is the "best" way to memorize. As you memorize
						more and more, you'll find easier ways of doing things that work best for you.
					</p>
					<p>
						That being said, here's <em>one</em> method that I have found useful.
					</p>
					<p>
						If you've never tried to memorize an extended passage of scripture
						before, or have only ever memorized a verse or two at a time, start
						with a short Psalm that you like.
					</p>
					<p>
						In this example, we'll practice by using Psalm 117 &#40;the shortest one&#41;, but feel free to
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
								Speak the entire &#40;original&#41; text out loud a few times, or listen
								to the audio version of the text a few times. Do this until you
								feel like you have a sense of the overall meaning of the
								passage as a whole.
							</li>
							<li value={++listItemCounter}>
								Look up any unfamiliar words or the meaning of particular verses
								that you don't understand.
							</li>
							<aside className={styles.aside}>
								While it is useful and spiritually beneficial to deeply study the passages
								you memorize, don't get caught up on needing to understand "everything" about a
								passage before you memorize it. As Christians, we spend all our whole lives growing
								to know and love God's Word more deeply, and that process doesn't <em>end</em> once you
								memorize a verse or passage. In fact, it is really only the <em>beginning</em> of the
								lifelong meditation you will continue do on the text—now with the words written on your heart.

								For an excellent article on the topic, see
								{' '}
								<a href="https://www.cc.lutherclassical.org/spring-2022/on-learning-by-heart/?utm_source=substack&utm_medium=email">
									this article by Pastor Ryan Loeslie
								</a>. He quotes the historian Heinrich von Treitschke,
								<blockquote>
									Also the church-hostile press acts very clever when it constantly rails against `dull memorization.` They believe wrongly. This worldly darkness of knowledge thoroughly forgets that even the mature man only partly understands religious truths. Only when he has first made a self-concerted effort to learn them himself can these religious truths be grasped firmly. Likewise, the sublime sayings of biblical wisdom survive in a receptive memory, even when they are not engaged. Then suddenly come temptations and tragedies of life, and they prove to be a comforting and edifying power.
								</blockquote>
							</aside>
							<li value={++listItemCounter}>
								Start with the first line. There are two primary methods:
							</li>
							<li
								style={{
									listStyle: 'none',
								}}
							>
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
				<section id="how-this-technique-works">
					<h2>How This Technique Works</h2>
					<p>
						This process works well for most people because of a psychological
						principle called{' '}
						<ExternalLink to="https://en.wikipedia.org/wiki/Chunking_(psychology)">
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
				<section id="how-to-review">
					<h2>How To Review</h2>
					<p>
						Once the text is memorized, it's important to regularly review what
						you have learned. I always begin my study sessions with review
						before learning any new material. If pressed for time, it's far
						better to retain the words you've already worked so hard to learn
						than to learn new passages.
					</p>
					<p>
						On the <InternalLink to="/memorize">Memorize Page</InternalLink>,
						you can test your knowledge of a passage by recording yourself. When
						you're done speaking the passage, listen to the recording while
						looking at the passage to see how closely you recited it. For bonus
						practice speak it once more while you listen to yourself to
						reinforce the passage even further.
					</p>
					<p>
						One of the most efficient ways that I have found to time my reviews
						is by using a spaced repetition flash card system, such as{' '}
						<ExternalLink to="https://apps.ankiweb.net/">Anki</ExternalLink> to
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
				<section id="contact">
					<h2>Contact</h2>
					<p>
						I hope you find this app to be a blessing in your faith life. If you
						are interested in contributing to this project, have questions,
						comments, suggestions, bug reports, or if you're just interested in
						chatting, please don't hesitate to contact me via the{' '}
						<InternalLink to="/contact">Contact</InternalLink> page on this
						website, and I'll get back to you shortly. Additionally, I can be
						reached via my{' '}
						<ExternalLink to="https://austintheriot.com/contact">
							website
						</ExternalLink>
						,{' '}
						<ExternalLink to="https://www.linkedin.com/in/austinmtheriot/">
							LinkedIn
						</ExternalLink>
						, or by{' '}
						<ExternalLink to="mailto:austinmtheriot@gmail.com?subject=Scripture Memorization App">
							emailing me directly
						</ExternalLink>
						.
					</p>
					<p>
						Checkout out the{' '}
						<ExternalLink to="https://github.com/austintheriot/memorize-scripture">
							GitHub repository
						</ExternalLink>{' '}
						for this project.
					</p>
					<p>
						This project was made with love and is offered free of charge. If
						you'd like to contribute code to this project or if you would like
						to donate towards website upkeep costs, please contact me (see
						above).
					</p>
				</section>
				<section className={styles.copyright}>
					<p>Originally published October 22, 2020.</p>
					<p>Last updated January 24, 2022.</p>
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

export default About;

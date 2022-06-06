import React, { useState, ChangeEvent } from 'react';
import styles from './Contact.module.scss';

//Material UI
import Input from 'components/Input/Input';

import { emailAPIUrl } from '../../app/config';

import { ErrorBoundary } from '../../components/ErrorBoundary/ErrorBoundary';
import { Footer } from '../../components/Footer/Footer';
import { validateEmail } from 'utils/validation';
import FocusRing from 'components/FocusRing/FocusRing';
import Textarea from 'components/Textarea/Textarea';

const Contact = () => {
	const [email, setEmail] = useState('');
	const [emailDisabled, setEmailDisabled] = useState(false);

	const [message, setMessage] = useState('');
	const [messageDisabled, setMessageDisabled] = useState(false);

	const [buttonDisabled, setButtonDisabled] = useState(false);
	const [userMessage, setUserMessage] = useState('');

	const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) =>
		setEmail(e.target.value);
	const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
		setMessage(e.target.value);
	const handleFocus = () => setUserMessage('');


	const disableElements = (disable: boolean) => {
		setEmailDisabled(disable);
		setMessageDisabled(disable);
		setButtonDisabled(disable);
	};

	const clearInputs = () => {
		setEmail('');
		setMessage('');
	};

	const WEBSITE_URL = 'memorizescripture.org';

	const sendSubmission = async () =>
	fetch(
		emailAPIUrl,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email: email,
				message: message,
				website: WEBSITE_URL
			}),
		},
	)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (validateEmail(email)) {
			setUserMessage('Please correct all errors before submitting');
			return;
		}
		disableElements(true);
		setUserMessage('Sending message...');
		try {
			const data = await sendSubmission();
			disableElements(false);
			if (data.status !== 200) {
				setUserMessage(
					'Sorry, there was an error processing your message. Please try again later.',
				);
			} else {
				console.log(data);
				clearInputs();
				setUserMessage('Your message was successfully received!');
			}
		} catch (error) {
			console.error(error);
			setUserMessage(
				'Sorry, there was an error processing your message. Please try again later.',
			);
		}
		console.log('Form submitted!');
	};

	return (
		<ErrorBoundary>
			<main>
				<h1 className={styles.h1}>Contact</h1>
				<p className={styles.note}>
					If you are submitting a bug report or a feature request, please be as
					detailed as possible. Thank you!
				</p>
				<form
					noValidate
					autoComplete="off"
					className={styles.root}
					onSubmit={handleSubmit}
				>
					<Input
						value={email}
						id="email"
						type="email"
						label="Email"
						required
						onChange={handleEmailChange}
						disabled={emailDisabled}
						validate={validateEmail}
						onFocus={handleFocus}
						validateOnBlur
						validateOnChange={false}
					/>
					<Textarea
						value={message}
						rows={4}
						id="message"
						label="Message"
						onChange={handleMessageChange}
						onFocus={handleFocus}
						disabled={messageDisabled}
						componentStyles={styles.InputComponentStyles}
					/>
					{userMessage && <p className={styles.userMessage}>{userMessage}</p>}
					<button
						aria-label="submit"
						disabled={buttonDisabled}
						className={[
							'button',
							styles.submit,
							buttonDisabled ? styles.disabled : '',
						].join(' ')}
					>
						Submit
							<FocusRing />
					</button>
				</form>
				<Footer />
			</main>
		</ErrorBoundary>
	);
};

export default Contact;

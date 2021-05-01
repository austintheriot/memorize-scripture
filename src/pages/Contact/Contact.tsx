import React, { useState, ChangeEvent } from 'react';
import styles from './Contact.module.scss';

//Material UI
import Input from 'components/Input/Input';

import { emailAPIKey } from '../../app/config';
import { makeStyles } from '@material-ui/core/styles';

import { ErrorBoundary } from '../../components/ErrorBoundary/ErrorBoundary';
import { Footer } from '../../components/Footer/Footer';
import { validateEmail } from 'utils/validation';

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(0.25),
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
	iconButton: {
		width: 'max-content',
	},
	label: {
		color: 'var(--primary_100)',
		zIndex: 1,
		left: '0.6rem',
	},
	input: {
		padding: '1rem 1rem',
		backgroundColor: 'var(--primary_20)',
		color: 'var(--primary_100)',
		fontSize: '1.1rem',
	},
}));

const Contact = () => {
	const [email, setEmail] = useState('');
	const [emailDisabled, setEmailDisabled] = useState(false);

	const [message, setMessage] = useState('');
	const [messageDisabled, setMessageDisabled] = useState(false);

	const [buttonDisabled, setButtonDisabled] = useState(false);
	const [userMessage, setUserMessage] = useState('');

	const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) =>
		setEmail(e.target.value);
	const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) =>
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

	const sendSubmission = async () =>
		(
			await fetch(
				'https://us-central1-austins-email-server.cloudfunctions.net/sendEmail/contactForm',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						name: '',
						email: email,
						message: message,
						_private: {
							key: emailAPIKey,
						},
					}),
				},
			)
		).json();


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
			if (data.error) {
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
					<Input
						value={message}
						id="message"
						label="Message"
						onChange={handleMessageChange}
						onFocus={handleFocus}
						disabled={messageDisabled}
					/>
					<p className={styles.userMessage}>{userMessage}</p>
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
					</button>
				</form>
				<Footer />
			</main>
		</ErrorBoundary>
	);
};

export default Contact;

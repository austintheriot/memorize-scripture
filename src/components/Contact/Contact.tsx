import React from 'react';
import styles from './Contact.module.scss';
import TextField from '@material-ui/core/TextField';

export const Contact = () => {
	return (
		<main>
			<form noValidate autoComplete='off' className={styles.root}>
				<h1>Contact</h1>
				<div className={styles.inputWrapper}>
					<TextField
						className={styles.input}
						fullWidth={true}
						id='outlined-basic'
						label='Email *'
						variant='outlined'
					/>
				</div>
				<div className={styles.inputWrapper}>
					<TextField
						className={styles.input}
						fullWidth={true}
						id='outlined-multiline-static'
						label='Message *'
						multiline
						rows={4}
						variant='outlined'
					/>
				</div>
				<button className={['button', styles.submit].join(' ')}>Submit</button>
			</form>
		</main>
	);
};

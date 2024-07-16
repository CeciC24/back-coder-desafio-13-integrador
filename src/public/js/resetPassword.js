const form = document.getElementById('resetForm')

form.addEventListener('submit', (e) => {
	e.preventDefault()
	const data = new FormData(form)
	const obj = {}
	data.forEach((value, key) => (obj[key] = value))
	const pathSegments = window.location.pathname.split('/');
    const token = pathSegments[pathSegments.length - 1];
	obj.token = token

	console.log(obj)

	fetch('/api/sessions/reset-password', {
		method: 'POST',
		body: JSON.stringify(obj),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((json) => {
			form.reset()
			console.log(json)
		})
})
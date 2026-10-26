async function notifyDiscord(meddelande) {
    //console.log(meddelande)
    await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: meddelande })
    })
}

async function notifyUpdate(data) {
    try {
        await notifyDiscord(`Bokning uppdaterad: ${data.resource_id}`)
    }
    catch (error) {
        console.error('Notifiering misslyckades:', error.message)
    }
}

async function notifyBook(data) {
    try {
        await notifyDiscord(`Bokning genomförd: ${data.resource_id}`)
    }
    catch (error) {
        console.error('Notifiering misslyckades:', error.message)
    }
}

async function notifyDelete(data) {
    try {
        await notifyDiscord(`Bokning avslutad: ${data.resource_id}`)
    }
    catch (error) {
        console.error('Notifiering misslyckades:', error.message)
    }
}

async function notifyTest(word) {
    try {
        await notifyDiscord(`Test: ${word}`)
    }
    catch (error) {
        console.error('Notifiering misslyckades:', error.message)
    }
}

export { notifyUpdate, notifyTest, notifyDiscord, notifyBook, notifyDelete };
let messages = [
    "Thanks for opening up to me.",
    "I'm here for you when you need me.",
    "People do get better.",
    "Can I drive you to an appointment?",
    "How are you feeling today?",
    "I Love You"
]

let randomMessage = Math.floor(Math.random() * messages.length);
console.log(randomMessage);
console.log(messages[randomMessage])

let messageContainer = document.getElementById("message");

messageContainer.innerHTML = messages[randomMessage];


// $("#click-me)").click(function(){
//     let val=1    
//     val= Math.floor(Math.random()*6)
//     +1
// })



// switch(val){
//     case 1:
//         console.log("Thanks for opening up to me.")
//         $("#message").html("Thanks for opening up to me.")
//         break
//     case 2:
//         console.log("I'm here for you when you need me.")
//         $("#message").html("I'm here for you when you need me.")
//         break
//     case 3:
//         console.log("I can't imagine what you're going through.")
//         $("#message").html("I can't imagine what you're going through.")
//         break
//     case 4:
//         console.log("People do get better.")
//         $("#message").html("People do get better.")
//         break
//     case 5:
//         console.log("Can I drive you to an appointment?")
//         $("#message").html("Can I drive you to an appointment?")
//         break
//     case 6:
//         console.log("How are you feeling today?")
//         $("#message").html("How are you feeling today?")
//         break
//     default:
//         console.log("I Love You")
//         $("#message").html("I Love You")
//         break
// }
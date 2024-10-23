// Select Elements
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizAarea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText); // to convert the response text to javaScript Object;
      let qCount = questionsObject.length; // The Length Of The Object;
      // Create Bullets + Set Questions Count
      createBulltes(qCount);

      // Add Question Data
      addQuestionData(questionsObject[currentIndex], qCount);

      // Start Countdown
      countdown(3, qCount);

      // Click On Submit
      submitButton.onclick = () => {
        // Get Right Answer
        let theRightAnswer = questionsObject[currentIndex].right_answer;

        // Increase Index
        currentIndex++;

        // Check The Answer
        checkAnswer(theRightAnswer, qCount);

        // Remove Previous Question
        quizAarea.innerHTML = "";
        answerArea.innerHTML = "";

        // Add Next Question Data
        addQuestionData(questionsObject[currentIndex], qCount); // Because currentIndex Is Increased;

        // Handle Bullets Class
        handleBullets();

        // Start Countdown When You Click On Submit Button
        clearInterval(countdownInterval); // Stop Countdown When You Click On Submit Button;
        countdown(3, qCount);

        // Show Results
        showResults(qCount);
      };
    }
  };

  myRequest.open("GET", "html.questions.json", true);
  myRequest.send();
}

getQuestions();

function createBulltes(num) {
  countSpan.innerHTML = num;

  // Create Spans
  for (let i = 0; i < num; i++) {
    // Create Span
    let theBullet = document.createElement("span");

    // Check If Its The First Span
    if (i === 0) {
      theBullet.className = "on";
    }

    // Append Bullets To Main Bullet Container
    bulletsSpanContainer.appendChild(theBullet);
  }
}

// 5
// 1, 2, 3, 4 => length = index + 1;

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // Create H2 Question Title
    let questoinTitle = document.createElement("h2");

    // Create Question Text
    let questionText = document.createTextNode(obj["title"]);

    // Append Text To H2
    questoinTitle.appendChild(questionText);

    // Append H2 To The Quiz Area
    quizAarea.appendChild(questoinTitle);

    // Create The Answers
    for (let i = 1; i <= 4; i++) {
      // Create Main Answer Div
      let mainDiv = document.createElement("div");

      // Add Class To Main Div
      mainDiv.className = "answer";

      // Create Radio Input
      let radioInput = document.createElement("input");

      // Add Some Attributes To Radion Input
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`; // to set a relationship with the label;
      radioInput.dataset.answer = obj[`answer_${i}`]; // dataset.answer = add attribute on element with data.answer;

      // Make The First Option Selected
      if (i === 1) {
        radioInput.checked = true;
      }

      // Create Label
      let theLabel = document.createElement("label");

      // Add For Attribute
      theLabel.htmlFor = `answer_${i}`; // to set 'for' attribute on label;

      // Add Label Text
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);

      // Add The Text To Label
      theLabel.appendChild(theLabelText);

      // Append Input + Label To Main Div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      // Append Main Div To Answer Area
      answerArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChosenAnswer = answers[i].dataset.answer;
    }
  }
  if (rAnswer === theChosenAnswer) {
    rightAnswers++;
    console.log("Good Answer");
  }
}

function handleBullets() {
  let bulletsSpan = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpan); // To Use Its Index In Order To Compare With 'currentIndex';
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    // Mean currentIndex = 9 && count = 9 => The Questions Are Finished, So Show The Result;

    quizAarea.remove();
    answerArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good</span>, ${rightAnswers}/${count}`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span>, All Answers Are True`;
    } else {
      theResults = `<span class="bad">Bad</span>, ${rightAnswers}/${count}`;
    }

    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "10px";
  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60); // parseInt => To Convert The Number From Decimal To Integer parseInt(2.5) = 2;
      seconds = parseInt(duration % 60); // To Get The Rest Of The Division;

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}

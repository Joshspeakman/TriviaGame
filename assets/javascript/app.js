$(document).ready(function() {
  $(document).one("keyup", function(e) {
    $(".startMessage").html('Question <span class="numQuestion">1</span>');
    $(".questionBody").prop("hidden", false);
    $(".score").prop("hidden", false);
    nextWord();
    music.play();
  });
  
  var music = new Audio('assets/sounds/star-wars-theme-song.mp3');
  
  var questionAnswerArray = [
    {
      question:
        "What were Luke's aunt and uncle's job on Tatooine?",
      options: [
        "Tusken Raider",
        "Bounty Hunter",
        "Moisture farmers",
        "Stormtroopers"
      ],
      answer: "Moisture farmers",
      asked: false
    },
    {
      question:
        "What day is Wookiee Life Day, and where did we first learn about the holiday?",
      options: ["November 17", "May 12", "June 15", "December 24"],
      answer: "November 17",
      asked: false
    },
    {
      question:
        "What is the Wookiee's home world",
      options: [
        "Crait",
        "Kashyyyk",
        "Batuu",
        "Bespin"
      ],
      answer: "Kashyyyk",
      asked: false
    },
    {
      question:
        "Which character is partially named after George Lucas's son?",
      options: ["Dexter Jettster", "Tobias Beckett", "Mace Windu", "Poe Dameron"],
      answer: "Dexter Jettster",
      asked: false
    },
    {
      question:
        "How many Dewbacks were in the original 1977 theatrical cut of the first Star Wars movie?",
      options: [
        "Two",
        "Three",
        "Four",
        "Five"
      ],
      answer: "Two",
      asked: false
    },
    {
      question:
        "Which species stole the plans to the Death Star?",
      options: [
        "Arcona",
        "Quarren",
        "Bothan",
        "Jawas"
      ],
      answer: "Bothan",
      asked: false
    },
    {
      question:
        "What was the original name of the first Star Wars movie when it went into production?",
      options: [
        "Adventures of Luke Starkiller",
        "The StarKiller Saga",
        "Star Fighter Saga",
        "The Force"
      ],
      answer: "Adventures of Luke Starkiller",
      asked: false
    },
    {
      question:
        "Who kissed Leia first?",
      options: [
        "Han Solo",
        "Luke Skywalker",
        "Chewbacca",
        "Lando Calrissian"
      ],
      answer: "Luke Skywalker",
      asked: false
    },
    {
      question: "Who is Lando Calrissian's co-pilot in Return of the Jedi?",
      options: [
        "Han Solo",
        "Boba Fett",
        "Chewbacca",
        "Nien Nunb"
      ],
      answer: "Nien Nunb",
      asked: false
    },
    {
      question: "What is the name of Boba Fett's ship?",
      options: ["Slave 1", "Ebon Hawk", "Ghost", "Millennium Falcon"],
      answer: "Slave 1",
      asked: false
    }
  ];

  var numCorrect = 0,
    numIncorrect = 0;

  var populateQuestionsAndOptions = function(question) {
    $(".questionText").text(question.question);
    var optionArray = shuffle(question.options);
    $(".option1").text(optionArray[0]);
    $(".option2").text(optionArray[1]);
    $(".option3").text(optionArray[2]);
    $(".option4").text(optionArray[3]);
    $("button.list-group-item").removeClass(
      "list-group-item-success list-group-item-danger text-danger"
    );
  };

  function countDown() {}

  var playAQuestion = function(question) {
    var cardFooter = $("div.card-footer");
    var n = 15;
    var timeout = setInterval(function() {
      if (n >= 0) {
        $(".timeLeft").html(n);
        n--;
      } else {
        cardFooter.html("Times Up!");
        incorrectAnswerResult(question, cardFooter);
        clearInterval(timeout);
      }
    }, 1000);
    questionAnswerArray[questionAnswerArray.indexOf(question)].asked = true;
    populateQuestionsAndOptions(question);

    cardFooter.html("");
    cardFooter.removeClass("text-danger text-success");
    cardFooter.prop("hidden", true);
    $("button").click(function(e) {
      clearInterval(timeout);
      $(".timeLeft").html(0);
      e.preventDefault();
      if ($(this)[0].textContent === question.answer) {
        $(this).addClass("list-group-item-success");
        numCorrect++;
        $(".numCorrect").html(numCorrect);
        cardFooter.prop("hidden", false);
        cardFooter.html("Correct!");
        cardFooter.addClass("text-success");
        setTimeout(nextWord, 2000);
      } else {
        $(this).addClass("list-group-item-danger");
        cardFooter.html("Incorrect!");
        incorrectAnswerResult(question, $(this));
      }
      $("button").off("click");
    });
  };

  var incorrectAnswerResult = function(question, cardFooter) {
    numIncorrect++;
    $(".numIncorrect").html(numIncorrect);
    cardFooter.prop("hidden", false);
    cardFooter.addClass("text-danger");
    var answerDiv = $("button").filter(function() {
      return this.textContent === question.answer;
    });
    answerDiv.addClass("list-group-item-success");
    $("button").off("click");
    setTimeout(nextWord, 2000);
  };

  var isPlayable = function(question) {
    return question.asked == false;
  };

  var nextWord = function() {
    var playableQuestions = questionAnswerArray.filter(isPlayable);
    if (playableQuestions.length > 0) {
      $(".numQuestion").html(
        questionAnswerArray.length - playableQuestions.length + 1
      );
      playAQuestion(
        playableQuestions[Math.floor(Math.random() * playableQuestions.length)]
      );
    } else {
      $(".timer").prop("hidden", true);
      $(".gameContainer").prop("hidden", true);
      var resetButton = $("button.reset");
      resetButton.prop("hidden", false);
      resetButton.click(function(e) {
        e.preventDefault();
        numCorrect = 0;
        $(".numCorrect").html(numCorrect);
        numIncorrect = 0;
        $(".numIncorrect").html(numIncorrect);
        questionAnswerArray.forEach(function(question) {
          question.asked = false;
        });
        $(".gameContainer").prop("hidden", false);
        resetButton.prop("hidden", true);
        $(".timer").prop("hidden", false);
        nextWord();
      });
    }
  };

  /**
   * Shuffles array in place.
   * @param {Array} a items An array containing the items.
   */
  var shuffle = function(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  };
});

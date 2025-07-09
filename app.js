    document.addEventListener('DOMContentLoaded', () => {
        let getBtn = document.getElementById('btn');
        let ques = document.getElementById('ques');
        let opt1 = document.getElementById('opt1');
        let opt2 = document.getElementById('opt2');
        let opt3 = document.getElementById('opt3');
        let inputs = document.getElementsByTagName('input');
        let timerDisplay = document.getElementById('timer');
        let index = 0;
        let score = 0;
        let timerInterval;
        let timeLeft = 180;
        let questions = [];
        let progressFill = document.getElementById('progress');
        let progressText = document.getElementById('progress-text');

        updateProgressBar();

        fetch('https://opentdb.com/api.php?amount=10&type=multiple')
            .then(res => res.json())
            .then(data => {
                questions = data.results.map(q => {
                    const correct = decodeHTML(q.correct_answer);
                    const incorrect = q.incorrect_answers.map(decodeHTML);
                    const options = shuffleArray([correct, ...incorrect]);

                    return {
                        question: decodeHTML(q.question),
                        option1: options[0],
                        option2: options[1],
                        option3: options[2],
                        correctOption: correct
                    };
                });
                showQuestion();
                startTimer();
            });

        function showQuestion() {
            if (index >= questions.length) {
                clearInterval(timerInterval);
                Swal.fire({
                    title: "Quiz Completed!",
                    text: `Your score is ${score}/${questions.length}`,
                    icon: "success",
                    background: '#1a2035',
                    color: 'white',
                    confirmButtonColor: '#4361ee'
                }).then(() => location.reload());
                return;
            }

            const q = questions[index];
            ques.innerText = q.question;
            opt1.innerText = q.option1;
            opt2.innerText = q.option2;
            opt3.innerText = q.option3;
            getBtn.disabled = true;
            
            updateProgressBar();
        }

        function updateProgressBar() {
            const progressPercent = (index / questions.length) * 100;
            progressFill.style.width = `${progressPercent}%`;
            progressText.innerText = `${index}/${questions.length}`;
        }

        function nextQuestion() {
            let selectedOption = '';
            for (let i = 0; i < inputs.length; i++) {
                if (inputs[i].checked) {
                    selectedOption = document.getElementById(`opt${i + 1}`).innerText;
                }
                inputs[i].checked = false;
            }

            if (selectedOption === questions[index].correctOption) {
                score++;
            }

            index++;
            showQuestion();
        }

        for (let i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('change', () => {
                getBtn.disabled = false;
            });
        }

        function startTimer() {
            clearInterval(timerInterval);
            timeLeft = 180;

            timerInterval = setInterval(() => {
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    Swal.fire({
                        title: "Time's Up!",
                        text: "Quiz is restarting...",
                        icon: "error",
                        background: '#1a2035',
                        color: 'white',
                        confirmButtonColor: '#4361ee'
                    }).then(() => location.reload());
                } else {
                    const minutes = Math.floor(timeLeft / 60);
                    const seconds = timeLeft % 60;
                    timerDisplay.innerText = `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
                    timeLeft--;
                }
            }, 1000);
        }

        function decodeHTML(str) {
            const text = document.createElement('textarea');
            text.innerHTML = str;
            return text.value;
        }

        function shuffleArray(array) {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        }

        getBtn.addEventListener('click', nextQuestion);
    });
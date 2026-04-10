function renderQuestions() {
    questionList.innerHTML = '';
    const visibleQuestions = getVisibleQuestions();
    visibleQuestions.forEach((q, i) => {
        const card = renderQuestionCard(q, i);
        questionList.appendChild(card);
    });
    updateProgress();
}

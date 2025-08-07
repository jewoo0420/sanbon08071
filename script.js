function getMeal() {
  const dateInput = document.getElementById("date").value;
  const mealInfoDiv = document.getElementById("meal-info");

  if (!dateInput) {
    mealInfoDiv.innerHTML = "<p>날짜를 선택해주세요.</p>";
    return;
  }

  const apiURL = `https://open.neis.go.kr/hub/mealServiceDietInfo?ATPT_OFCDC_SC_CODE=J10&SD_SCHUL_CODE=7530079&MLSV_YMD=${dateInput.replace(/-/g, "")}`;

  fetch(apiURL)
    .then(response => {
      if (!response.ok) {
        throw new Error("네트워크 오류");
      }
      return response.text();
    })
    .then(str => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(str, "application/xml");

      const mealElement = xml.querySelector("DDISH_NM");
      const mealTime = xml.querySelector("MMEAL_SC_NM");

      if (mealElement && mealTime) {
        // 급식 내용 정리 (줄바꿈 문자 <br/> 또는 \n 로 교체)
        const mealText = mealElement.textContent.replace(/<br\/>/g, "\n").replace(/\./g, "");
        mealInfoDiv.innerHTML = `
          <h3>${mealTime.textContent} 급식</h3>
          <pre>${mealText}</pre>
        `;
      } else {
        mealInfoDiv.innerHTML = "<p>해당 날짜의 급식 정보가 없습니다.</p>";
      }
    })
    .catch(error => {
      console.error(error);
      mealInfoDiv.innerHTML = "<p>급식 정보를 불러오는 중 오류가 발생했습니다.</p>";
    });
}

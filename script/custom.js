/* 1. 풀페이지 설정 (기존 유지) */
var myFullpage = new fullpage('#fullpage', {
  verticalCentered: true,
  anchors: ['anchor1', 'anchor2', 'anchor3', 'anchor4', 'anchor5'],
  menu: '#menu',
  scrollOverflow: true,
  scrollingSpeed: 1000,
  navigation: true,
  navigationPosition: 'right',
  navigationTooltips: ['1', '2', '3', '4', '5', '6'],
  responsiveWidth: 999,

  // [수정됨] 섹션에 도착했을 때
  afterLoad: function (origin, destination) {
    
    // 섹션 3: 풍선 애니메이션
    if (destination.index === 2) {
      document.querySelector('.me_balloon')?.classList.add('show');
    }

    // [수정 포인트 1] 섹션 5(Career) 또는 섹션 6(Footer)에 도착하면 기차 출발!
    // (푸터에 도착해도 기차가 계속 달려야 하므로)
    if (destination.index === 4 || destination.index === 5) {
      document.querySelector('.train')?.classList.add('running');
    }
  },

  // [수정됨] 섹션을 떠날 때
  onLeave: function (origin, destination) {
    
    // 섹션 3 떠날 때: 풍선 초기화
    if (origin.index === 2) {
      document.querySelector('.me_balloon')?.classList.remove('show');
    }

    // [수정 포인트 2] 기차 멈추는 조건 변경
    // "목적지가 섹션 5도 아니고, 섹션 6도 아닐 때"만 기차를 멈춤
    // 즉, 5번과 6번 사이에서는 기차가 사라지지 않음
    if (destination.index !== 4 && destination.index !== 5) {
      document.querySelector('.train')?.classList.remove('running');
    }
  },

  afterResponsive: function (isResponsive) {}
});

/* 2. 팝업 및 슬라이드 통합 관리 (충돌 해결됨) */
$(document).ready(function () {
  // 각 팝업의 슬라이드 변수 저장공간
  let swiper1, swiper2, swiper3;

  // 팝업 열기 + 슬라이드 시작 함수
  function openPopup(popupSelector, swiperInstance, swiperContainerClass) {
    const $popup = $(popupSelector);
    
    // 1) 팝업 보이기
    $popup.addClass('active');

    // 2) 기존에 실행된 슬라이드가 꼬이지 않게 삭제 후 재실행
    if (swiperInstance) {
      swiperInstance.destroy(true, true);
    }

    // 3) 약간의 딜레이(0.1초)를 주어 팝업이 확실히 뜬 뒤 슬라이드 실행 (오류 방지 핵심)
    setTimeout(function() {
      swiperInstance = new Swiper(swiperContainerClass, {
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        observer: true,       // 중요: 숨겨진 요소 감지
        observeParents: true, // 중요: 부모 요소 변경 감지
        speed: 800,
      });
    }, 100);

    return swiperInstance;
  }

  // --- [이벤트 연결] ---
  
  // 첫 번째 카드뉴스 클릭
  $('.art1-trigger').on('click', function () {
    swiper1 = openPopup('.pop1', swiper1, '.mySwiper1');
  });

  // 두 번째 카드뉴스 클릭
  $('.art2-trigger').on('click', function () {
    swiper2 = openPopup('.pop2', swiper2, '.mySwiper2');
  });

  // 세 번째 (이모티콘) 클릭
  $('.art3-trigger').on('click', function () {
    swiper3 = openPopup('.pop3', swiper3, '.mySwiper3');
  });


  // --- [팝업 닫기] ---
  $('.close, .popup').on('click', function (e) {
    // 검은 배경(.popup)이나 닫기 버튼(.close)을 눌렀을 때만 닫힘
    if ($(e.target).hasClass('popup') || $(e.target).closest('.close').length > 0) {
      
      $('.popup').removeClass('active'); // 팝업 숨김

      // 팝업 닫을 때 슬라이드 기능도 정지 (메모리 절약 및 버그 방지)
      if (swiper1) { swiper1.destroy(true, true); swiper1 = null; }
      if (swiper2) { swiper2.destroy(true, true); swiper2 = null; }
      if (swiper3) { swiper3.destroy(true, true); swiper3 = null; }
    }
  });

});
$(function () {

  // Базовые значения
  var sumValue = 5000;
  var daysValue = 25;
  var dayPercent = 0.0217;
  var formState = 'default';
  var stock3days = true; // флаг, включающий акцию "первые 3 дня бесплатно"

  var stateSettings = {
    'default': {
      sumMin: 2000,
      sumMax: 15000,
      daysMin: 7,
      daysMax: 30
    },
    'new': { // Для новых клиентов
      sumMin: 2000,
      sumMax: 10000,
      daysMin: 7,
      daysMax: 30
    }
  };

  var calculator = {
    sumSlider: jQuery('.summ-blocks .one-s input'),
    daysSlider: jQuery('.summ-blocks .two-s input'),
    sumMinText: jQuery('.summ-blocks .one-s .min'),
    sumMaxText: jQuery('.summ-blocks .one-s .max'),
    daysMinText: jQuery('.summ-blocks .two-s .min'),
    daysMaxText: jQuery('.summ-blocks .two-s .max'),
    chance: jQuery('.content-row .gb span'),
    commission: jQuery('.content-row .commission span'),
    sumToBack: jQuery('.content-row .summToBack span'),
    dateToBack: jQuery('.content-row .dateToBack span'),
    sum: jQuery('.summ-block span.sum'),
    days: jQuery('.summ-block span.days')
  };

  var miniCalculator = {
    sumSlider   : jQuery('.block4 .borrowing input.one-ss'),
    sumText     : jQuery('.block4 .borrowing div.sum > span'),
    sumMinText  : jQuery('.block4 .borrowing .before'),
    sumMaxText  : jQuery('.block4 .borrowing .after'),
    subText     : jQuery('.block4 .borrowing .subText')
  };

  var triggerTabs = {
    new: function () {
      formState = 'new';
      $(".one-calc").removeClass('calc-hidden');
      $(".two-calc").addClass("calc-hidden");
      $(".b2").removeClass("but-bl");
      $(".b2").addClass("button-white");
      $(".b1").removeClass("but-whit");
      $(".b1").addClass("button-blue");
    },
    default: function () {
      formState = 'default';
      $(".two-calc").removeClass('calc-hidden');
      $(".one-calc").addClass("calc-hidden");
      $(".b1").removeClass("button-blue");
      $(".b1").addClass("but-whit");
      $(".b2").removeClass("button-white");
      $(".b2").addClass("but-bl");
    }
  };

  window.getDateToBack = function (data, day) {
    data = data.split('/');
    data = new Date(data[2], +data[1] - 1, +data[0] + day, 0, 0, 0, 0);
    data = [data.getDate(), data.getMonth() + 1, data.getFullYear()];
    data = data.join('/').replace(/(^|\/)(\d)(?=\/)/g, "$10$2");
    return data
  };

  function initCalculators() {
    // инициализируем большой калькулятор
    setCalculator();
    triggerTabs[formState]();
    calculator.sumSlider.val(sumValue);
    calculator.daysSlider.val(daysValue);
    renderCalculator();

    // инициализируем маленький калькулятор
    miniCalculator.sumSlider.attr(
      'min',
      stateSettings.default.sumMin
    );
    miniCalculator.sumSlider.attr(
      'max',
      stateSettings.default.sumMax
    );
    miniCalculator.sumSlider.val(sumValue);
    miniCalculator.subText.find('span').text(stateSettings.new.sumMax);
    renderMiniCalculator();

  }

  function setCalculator() {

    var settings = stateSettings[formState];
    calculator.sumSlider.attr(
      'min',
      settings.sumMin
    );
    calculator.sumSlider.attr(
      'max',
      settings.sumMax
    );
    calculator.daysSlider.attr(
      'min',
      settings.daysMin
    );
    calculator.daysSlider.attr(
      'max',
      settings.daysMax
    );
    calculator.sumMinText.text(
      settings.sumMin + ' руб'
    );
    calculator.sumMaxText.text(
      settings.sumMax + ' руб'
    );
    calculator.daysMinText.text(
      settings.daysMin + ' дн'
    );
    calculator.daysMaxText.text(
      settings.daysMax + ' дн'
    );

    inputRangeBG(calculator.daysSlider);
    inputRangeBG(calculator.sumSlider);
  }

  function getChance(sumValue) {
    if (formState === 'new') {
      chanceTitle = 'Вероятность одобрения';
      if (sumValue <= 8000) {
        chanceValue = 95;
        chanceComment = 'автоматическое одобрение';
      } else if (sumValue <= 15000) {
        chanceValue = 85;
        chanceComment = 'может потребоваться паспорт';
      } else {
        chanceValue = 75;
        chanceComment = 'потребуется паспорт';
      }
    } else {
      chanceTitle = 'Наш постоянный клиент?';
      chanceValue = 99;
      chanceComment = 'автоматическое одобрение!';
    }
    return {
      'chanceTitle': chanceTitle,
      'chanceValue': chanceValue,
      'chanceComment': chanceComment
    }
  }

  function renderCalculator() {

    var discountDays = (stock3days && formState === 'new') ? 3 : 0;

    var sum = calculator.sumSlider.val();
    var days = calculator.daysSlider.val();
    var commission = sum * dayPercent * (days - discountDays);
    var sumToBack = parseFloat(sum) + parseFloat(commission);
    var chance = getChance(sum);
    var dateObject = new Date();
    var today = dateObject.getDate() + '/' + (dateObject.getMonth() + 1) + '/' + dateObject.getFullYear();
    var date = getDateToBack(today, parseInt(days));

    calculator.sum.text(sum + ' р.');
    calculator.days.text(days + ' дн');
    calculator.commission.text(commission.toFixed(2));
    calculator.sumToBack.text(sumToBack.toFixed(2));
    calculator.chance.text(chance.chanceValue + '%');
    calculator.dateToBack.text(date);

  }

  function renderMiniCalculator() {
    var sum = miniCalculator.sumSlider.val();
    miniCalculator.sumText.html(
      sum + '<span> руб.</span>'
    );
  }

  $('.calculator input[type=range]').on('input', function () {
    renderCalculator();
  });

  $('.block4 .borrowing input[type=range]').on('input', function () {
    renderMiniCalculator();
  });

  $(".b1").click(function () {
    triggerTabs.new();
    setCalculator();
    renderCalculator();
  });

  $(".b2").click(function () {
    triggerTabs.default();
    setCalculator();
    renderCalculator();
  });


  initCalculators();

});



var inputRangeBG = function (e) {
  var r = $(e);
  var n = r.val();
  var mn = r.attr('min') ? r.attr('min') : 0;
  var mx = r.attr('max') ? r.attr('max') : 0;
  n = 100 * (n - mn) / (mx - mn); // процент положения ползунка относительно начала
  r.css({
    'background-image': '-webkit-linear-gradient(left ,#68d1f0 0%,#68d1f0 ' + n + '%,#fff ' + n + '%, #fff 100%)'
  });
};

function declOfNum(titles){
  var number = Math.abs(number);
  var cases = [2, 0, 1, 1, 1, 2];
  return function(number){
    return  titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
  }
}

var beautifyThousend = function (integer) {
  integer = integer ? integer : 0;
  var beautifyed = '';
  while (integer !== 0) {
    beautifyed = ' ' + integer % 1000 + beautifyed;
    integer -= integer % 1000;
    integer /= 1000;
  }
  return beautifyed;
};

var toTwoChars = function (int) {
  return int < 10 ? '0' + int : int;
};

var updateGetInTime = function () {
  var textElement = $('.receiptTime');
  var dateObj = new Date();
  var currentHour = dateObj.getHours();
  var currentMinutes = dateObj.getMinutes();

  var minutes = (currentMinutes + 15) % 60;
  var hours = currentHour + Math.trunc(currentMinutes / 60);
  hours = (24 === hours) ? 0 : hours;

  textElement.text(
    ' ' + toTwoChars(hours) + ':' + toTwoChars(minutes)
  );
};

var extraditionTextSet = function () {

  var clients = declOfNum(['клиенту', 'клиентам', 'клиентам']);
  var msInDay = 1000 * 60 * 60 * 24; // милисекунд в сутках
  var d = new Date(2017, 5, 1);
  var cd = new Date();
  var extraditions = Math.trunc(335 * (cd - d) / msInDay);

  $('header .extradition span').text(
    beautifyThousend(extraditions + 160000)
  );

  $('.block4 .extradition span').text(extraditions % 335);

  $('.block6-head h2 span').text(
    beautifyThousend(extraditions + 160000) + ' ' + clients(extraditions)
  );

};

$(document).ready(function () {

  $('.fancybox').fancybox();


  $(".phone").mask("+7 (999) 999-99-99");


  $('input').change(function () {
    $('input').removeClass('incorrect correct');
  });

  $(".answer div a").click(function () {
      $(this).parent().find(".answer-text").slideToggle();
  });


  $(".burger-block").click(function () {
    $(".habmenu").slideToggle('300');
  });

  $('.burger-block').click(function(){
      $(this).toggleClass('burger-block-open');
  });

  $(".slider-advantages .slick-slider").slick({
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    prevArrow: ".slick-prev",
    nextArrow: ".slick-next",
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });

  $(".reviews-slider .slick-slider").slick({
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    prevArrow: ".slick-pre",
    nextArrow: ".slick-nex",
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });

  var _download = false;
  var _target = '';
  $('form').ajaxForm({
    beforeSubmit: function (d, $e) {
      $('input').removeClass('incorrect');

      var emailReg = new RegExp("^[-0-9a-z\._]+\@[-0-9a-z\.]+\.[a-z]{2,4}$", "i"),
        phoneReg = '';

      for (var j in d) {
        /*телефон*/
        if (d[j].name == 'phone' && d[j].value == '') {
          $e.find('input[name="phone"]').addClass('incorrect');
          return false;
        }

        if (d[j].name == 'phone' && d[j].value != '') {
          for (var i = 0; i <= 9; i++) {
            phoneReg = new RegExp(i.toString() + i.toString() + i.toString() + i.toString() + i.toString() + i.toString() + i.toString());

            if (phoneReg.test(d[j].value)) {
              $e.find('input[name="phone"]').addClass('incorrect');
              return false;
            }
          }
        }

        $e.find('input[name="phone"]').addClass('correct');

        /*имя*/
        if (d[j].name == 'name' && d[j].value == '') {
          $e.find('input[name="name"]').addClass('incorrect');
          return false;
        }

        $e.find('input[name="name"]').addClass('correct');

        /*email*/
        if (d[j].name == 'email' && d[j].value == '') {
          $e.find('input[name="email"]').addClass('incorrect');
          return false;
        }

        if (d[j].name == 'email' && d[j].value != "") {
          if (!emailReg.test(d[j].value)) {
            $e.find('input[name="email"]').addClass('incorrect');
            return false;
          }
        }

        $e.find('input[name="email"]').addClass('correct');

        /*цель*/
        if (d[j].name == 'target') {
          _target = d[j].value;
        }

        if (d[j].name == 'download') {
          _download = true;
        }
      }

      return true;
    },

    success: function (data) {
      if (_download == true) {

        var link = document.createElement('a');
        link.setAttribute('href', '/price.pdf');
        link.setAttribute('download', 'download');
        onload = link.click();

        _download = false;
      }
      console.info(data);
      $('input').removeClass('incorrect correct');
      $.fancybox($('.thnx'));
    }
  });


  var r = $('input[type=range]');

  r.each(function (a, b) {
    inputRangeBG(b);
  });

  r.on('input', function () {
    inputRangeBG(this);
  });

  updateGetInTime();
  setInterval(updateGetInTime, 500);
  extraditionTextSet();

});

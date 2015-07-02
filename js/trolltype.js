requirejs(["jquery/jquery.min"], function (jquery) {
    
    jQuery(document).ready(function ($) {
        var _data;
        var _score;
        var _questionState;
        var _cardOrder;
        var _cardIndex;
        var _end;

        var init = function () {
            $("#ttt").empty();

            _cardIndex = 0;
            _end = false;

            _score = {
                "A": 0,
                "S": 0,
                "D": 0
            };

            _cardOrder = [];

            for (var i = 0; i < _data.Data.length; i++) {
                _cardOrder[i] = i;
            }

           // for (var j, x, i = _data.Data.length; i; j = Math.floor(Math.random() * i), x = _cardOrder[--i], _cardOrder[i] = _cardOrder[j], _cardOrder[j] = x);

            _questionState = [];

            $.each(_data.Data, function (key, val) {
                var card = '<div class="card" id="card' + key + '"><div id="question"><div><div>' + val.Q + '</div></div></div><div class="answer" id="answer1"><div><div>' + val.A[0].A + '</div></div></div><div class="answer" id="answer2"><div><div>' + val.A[1].A + '</div></div></div></div>';

                _questionState[key] = false;

                $("#ttt").append(card);
                
            });

            $(".answer").click(function () {
                var question = parseInt($(this).parent().attr("id").substr(4));

                if (!_questionState[question]) {
                    _questionState[question] = true;

                    var answer = ($(this).attr("id") == "answer1" ? 0 : 1);

                    var weights = _data.Data[question].A[answer].W;

                    _score.A += weights.A;
                    _score.S += weights.S;
                    _score.D += weights.D;

                    $(this).parent().css("zIndex", "20");

                    nextCard();

                    $(this).parent().animate({"left": "-=200px", "opacity": "0"}, 350, function () {
                        $(this).css("zIndex", "10");
                        if (_end) {
                            $(".card").each(function (index) {
                                if ($(this).attr("id") != "cardresult") {
                                    $(this).remove();
                                }
                            });
                        }
                    });
                }
            });

            nextCard();
            //result();
        };

        var result = function () {
            _end = true;

            var descA = "Die Aktionen eines Aufmerksamkeit-Trolls dienen nur dazu Aufmerksamkeit zu bekommen. Egal wie, Hauptsache Jemand nimmt ihn war.";
            var descS = "Die Aktionen eines Spaß-Trolls dienen lediglich seiner Belustigung. Er nimmt weder seine eigenen Kommentare, noch die anderer ernst.";
            var descD = "Die Aktionen eines Destruktiv-Trolls sind zerstörerisch. Ihm ist egal wie schlimm der Schaden ist den er anrichtet.";

            var trolltyp;
            var desc;
            var font_size = "20px";

            if (_score.A > _score.S && _score.A > _score.D) {
                trolltyp = "Aufmerksamkeits";
                desc = descA;
            }
            else if (_score.S > _score.A && _score.S > _score.D) {
                trolltyp = "Spaß";
                desc = descS;
            }
            else if (_score.D > _score.S && _score.D > _score.A) {
                trolltyp = "Destruktiv";
                desc = descD;
            }
            else if (_score.A == _score.S && _score.A > _score.D) {
                trolltyp = "Aufmerksamkeits-/Spaß";
                desc = descA + ' ' + descS;
                font_size = "18px";
            }
            else if (_score.A == _score.D && _score.A > _score.S) {
                trolltyp = "Aufmerksamkeits-/Destruktiv";
                desc = descA + ' ' + descD;
                font_size = "18px";
            }
            else if (_score.S == _score.D && _score.S > _score.A) {
                trolltyp = "Spaß-/Destruktiv";
                desc = descS + ' ' + descD;
                font_size = "18px";
            }
            else if (_score.A == _score.S && _score.S == _score.D) {
                trolltyp = "Aufmerksamkeits-/Spaß-/Destruktiv";
                desc = descA + ' ' + descS + ' ' + descD;
                font_size = "15px";
            }

            var max = Math.max(Math.max(_score.A, _score.S), _score.D);

            var bars = '<table id="resulttable" width="100%">'
                + '<tr><td>Aufmerksamkeit-Troll</td><td><div class="progress_bar" id="bar_a">' + Math.round((_score.A / max) * 100) + '%</div></td></tr>'
                + '<tr><td>Spaß-Troll</td><td><div class="progress_bar" id="bar_s">' + Math.round((_score.S / max) * 100) + '%</div></td></tr>'
                + '<tr><td>Destruktiv-Troll</td><td><div class="progress_bar" id="bar_d">' + Math.round((_score.D / max) * 100) + '%</div></td></tr>'
                + '</table>';

            var fb = '<span id="link_restart">Test erneut ausfüllen?</span>';

            var res = '<div class="card" id="cardresult"><div id="question"><div><div>Du bist ein ' + trolltyp + '-Troll! ' + desc + '</div></div></div><div class="result" id="result1"><div><div>' + bars + '</div></div></div><div class="result" id="result2"><div><div>' + fb + '</div></div></div></div>';

            // '<div id="result">' + JSON.stringify(_score) + '</div>'
            $("#ttt").append(res);

            $("#cardresult > #question").css("font-size", font_size);

            $("#link_restart").click(function () {
                init();
            });

            $("#bar_a").css("width", ((_score.A / max) * 85) + "mm");
            $("#bar_s").css("width", ((_score.S / max) * 85) + "mm");
            $("#bar_d").css("width", ((_score.D / max) * 85) + "mm");

            $("#cardresult").css("display", "block");
        };

        var nextCard = function () {
            if (_cardIndex == _data.Data.length) {
                result();

                return;
            }

            $("#card" + _cardOrder[_cardIndex]).css("zIndex", "10");
            $("#card" + _cardOrder[_cardIndex]).css("display", "block");

            ++_cardIndex;
        };

        $.getJSON("data.json", function (data) {
            _data = data;

            init();
        }).fail(function (jqXHR, status, error) {
            if (status == 'parsererror') {
                //not valid json
                alert("JSON invalid!");
            }
            else {
                //some other error
                alert("Error loading JSON!");
            }
        });
    });

});
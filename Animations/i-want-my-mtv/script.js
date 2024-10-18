$(document).ready(function () {
	$("body").hide(0).delay(500).fadeIn(1000);
	var gifLogo = [
		"https://mir-s3-cdn-cf.behance.net/project_modules/fs/4e0cc328008799.56e41b35c50a5.gif",
		"https://mir-s3-cdn-cf.behance.net/project_modules/1400_opt_1/d15e9128008799.56e41b36a8e6f.gif",
		"https://mir-s3-cdn-cf.behance.net/project_modules/fs/47171428008799.56e41b3897dfb.gif",
		"https://mir-s3-cdn-cf.behance.net/project_modules/fs/18f1e128008799.56e41b39392b1.gif",
		"https://mir-s3-cdn-cf.behance.net/project_modules/fs/7142c728008799.56e41b32d9084.gif"
	];

	var gifBg = [
		"https://mir-s3-cdn-cf.behance.net/project_modules/fs/21166e28008799.56e41b34c3e64.gif",
		"https://mir-s3-cdn-cf.behance.net/project_modules/fs/4c032e28008799.56e41b3bbd979.gif",
		"https://mir-s3-cdn-cf.behance.net/project_modules/fs/4e0cc328008799.56e41b35c50a5.gif",
		"https://mir-s3-cdn-cf.behance.net/project_modules/fs/7142c728008799.56e41b32d9084.gif",
		"https://mir-s3-cdn-cf.behance.net/project_modules/fs/56442f28008799.56e41b3d5f421.gif"
	];

	var tvColor = ["#E05AD6", "#19FCDF", "#FFCB05", "#FDB5F9", "#1685f8"];
	var strokeColor = ["#2a2569", "#BF85FE", "#1685f8", "#215BD0", "#403566"];

	(counter = 0),
		(timer = setInterval(function () {
			var selectedLogo = gifLogo[counter];
			var selectedBG = gifBg[counter];
			var selectedFill = tvColor[counter];
			var selectedStroke = strokeColor[counter];
			$("#mask-img").attr("href", selectedLogo);
			$("body").css({
				background: "url('" + selectedBG + "') center center / cover no-repeat"
			});
			$(".colors").css({
				fill: selectedFill
			});
			$(":root").get(0).style.setProperty("--stroke-color", selectedStroke);
			counter++;

			if (counter === gifLogo.length) {
				counter = 0;
			}
		}, 2000));
});
define(function(require, exports, module){
    var registry = {},
        _ = require('../vendor/lodash.min'),
        achievements = [],
        MostDownloadsAchievement = require('../achievements/mostDownloads'),
        MostTrendingAchievement = require('../achievements/mostTrending'),
        state = 'production'; //TODO: get this from config

    function getDownloadsCounterByDate(array, date){
        if (!date){
            return array[array.length - 1];
        }

        date = new Date(date);

        for(var i = array.length - 1; i >= 0; i --){
            var element = array[i],
                elDate = new Date(element.timestamp),
                hours = Math.abs(date - elDate) / 36e5;

            if (hours > 23 || i === 0){
                return element;
            }
        }
        return null;
    }

    function registerAchievements(){
        _.each(achievements, function(achievement){
            achievement.calculate(registry);
        });
    }

    exports.init = function(){
        var path = state === 'production'? 'http://brackets-rating.herokuapp.com/' : 'http://localhost:9000/';

        achievements.push(new MostDownloadsAchievement());
        achievements.push(new MostTrendingAchievement());

        $.ajax({
            url: path + 'ratings/'
        }).success(function(extensions){
            _.each(extensions, function(extension){
                var downloadsListSize = extension.downloads.length;
                if (downloadsListSize <= 1) {
                    extension.dailyDownloads = 0;
                } else {
                    var today = getDownloadsCounterByDate(extension.downloads),
                        yesterday = getDownloadsCounterByDate(extension.downloads, today.timestamp);
                    extension.dailyDownloads = today && yesterday? today.count - yesterday.count : 0;
                }
                registry[extension._id] = extension;
            });
            registerAchievements();
        });
    }

    exports.get = function(id){
        return registry[id];
    }
});

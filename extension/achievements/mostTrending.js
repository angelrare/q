define(function(require, exports, module){
    var Achievement = require('./achievement'),
        config = require('../config'),
        _ = require('../vendor/lodash.min'),
        numberOfTrendingExtensions = 7;

    function MostTrendingAchievement(){
        this.calculate = function(extensions){
            extensions = _.sortBy(extensions, function(el){
                return el.dailyDownloads?
                    - el.dailyDownloads:
                    0;
            });

            for (var i = 0; i < numberOfTrendingExtensions; i ++){
                if (!extensions[i]){
                    break;
                }
                this.writeBadge(i, extensions[i]);
            }
        }

        this.getTag = function(rating){
            return '<img src="'+config.root + 'images/trend.png"/>';
        }
    }

    MostTrendingAchievement.prototype = Achievement;

    module.exports = MostTrendingAchievement;
});

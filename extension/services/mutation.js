define(function (require, exports, module){
    var _ = require('../vendor/lodash.min'),
        target = $('body')[0],
        config = require('../config'),
        dialogId = '.extension-manager-dialog.modal',
        extensionService = require('./extensions'),
        downloadsTemplate = require('text!../templates/downloads.html'),
        selectTemplate = require('text!../templates/sortButton.html'),
        infoTemplate = require('text!../templates/moreInfo.html');

    function init(){
        var observer = new MutationObserver(function(mutations){
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes && mutation.addedNodes.length === 1){
                    dialogAddedMutation(mutation);
                }
            });
        }),
            observerConfig = config.mutationObserverConfig;
        observer.observe(target, observerConfig);
    }

    function dialogAddedMutation(mutation){
        var waitForRegistry = true;

        function registryUpdateAction(){
            waitForRegistry = false;
        }

        extensionService.updateRegistry()
            .then(registryUpdateAction, registryUpdateAction);

        var target = $(mutation.addedNodes[0]),
            token;

        if (target.find(dialogId).length === 1){
            mutateSortButton(target);
            mutateTabButtons(target);

            token = setInterval(function(){
                var extensions = target.find('#registry tr, #installed tr'),
                    extensionCount = extensions.length;
                if (extensionCount < 200 || waitForRegistry){
                    return;
                }

                clearInterval(token);
                console.log('Found ' + extensionCount + ' extensions');

                //extensionService.add(extensions);
                mutateExistingExtensions(extensions);
            }, 100);
        }
    }

    function mutateTabButtons(target){
        target.find('.nav-tabs li').click(function(){
            returnPanelToNorm();
        });
    }

    function mutateExistingExtensions(targets){
        if (targets.length === 0) return;

        $('#registry, #installed').click(function(event){
            var $t = $(event.target),
                $parent = $(event.currentTarget);

            if ($t.attr('class') === 'ext-link_more'){
                var id = $t.attr('data-extension-id'),
                    extension = extensionService.get(id);

                if ($parent.find('.ext-panel_more').length > 0){
                    $parent.find('.ext-panel_more').remove();
                }

                $parent.find('tr').hide();
                var insert = createMorePanelContent(id, extension, $parent);
                $parent.find('tr[data-extension-id="' + id + '"]')
                    .show()
                    .after(insert);
            }
        });

        _.each(targets, function(target){
            var $t = $(target),
                id = $t.find('[data-extension-id]').attr('data-extension-id'),
                extension = extensionService.get(id),
                totalDownloads = extension && extension.totalDownloads? extension.totalDownloads : 0;

            $t.attr('data-extension-id', id);

            $t.find('.ext-info').append(_.template(downloadsTemplate, {
                downloads: totalDownloads,
                id: id
            }));
            $t.attr('data-extension-loads', totalDownloads);
        });
    }

    function returnPanelToNorm(parent){
        $('.ext-panel_more').remove();
        if (parent){
            parent.find('tr').show();
        } else {
            $('#registry tr, #installed tr').show();
        }
    }

    function createMorePanelContent(id, extension, parent){
        var panel = $('<tr class="ext-panel_more"></tr>'),
            holder = $('<td colspan="3"></td>'),
            hide = $('<a href="#">Hide</a>');

        panel.append(holder);

        if (_.isArray(extension.versions)){
            var versions = extension.versions.slice().reverse(),
                showLines = 5;

            _.each(versions, function(info, index){
                holder.append(_.template('<div>v ${version} from ${date} - ${downloads} downloads</div>',{
                    version: info.version,
                    date: info.published,
                    downloads: info.downloads || 0
                }));
                if (index >= showLines - 1 && versions.length > showLines) {
                    var count = versions.length - (showLines - 1);
                    if (count === 1) {
                        holder.append('<div>... and one more version.</div>');
                    } else {
                        holder.append(_.template('<div>... and ${count} more versions.</div>',{ count : count }));
                    }
                    return false;
                }
            });
        }

        hide.click(function(){
            returnPanelToNorm(parent);
        });

        holder.append(hide);

        return panel;
    }

    function mutateSortButton(target){
        var $header = target.find('.modal-header'),
            $select = $(selectTemplate);

        $select.on('change', function(event){
            if (typeof this.value === 'string'){
                sort(this.value);
            }
        });
        $header.append($select);
    }

    var sortHandlers = {
        'downloads': function(elements){
            return elements = _.sortBy(elements, function(el){
                return -parseInt($(el).attr('data-extension-loads'));
            });
        },
        'author': function(elements){
            return _.sortBy(elements, function(el){
                return $(el).find('.ext-author a').text();
            });
        },
        'name': function(elements){
            return _.sortBy(elements, function(el){
                return $(el).find('.ext-author').text();
            });
        },
        'update': function(elements){
            return _.sortBy(elements, function(el){
                return - new Date($(el).find('.ext-date').text().replace(' - ', ''));
            });
        }
    }

    function sort(criteria){
        var handler = sortHandlers[criteria],
            holder = $(dialogId).find('.extension-list.active tbody'),
            elements = holder.find('tr');

        if (typeof handler !== 'function'){ return; }

        holder.empty();
        elements = handler(elements);
        holder.append(elements);
    }

    exports.init = init;
});

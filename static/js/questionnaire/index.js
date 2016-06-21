(function() {
  rivets.binders.input = {
    publishes: true,
    routine: rivets.binders.value.routine,
    bind: function(el) {
      return $(el).bind('input.rivets', this.publish);
    },
    unbind: function(el) {
      return $(el).unbind('input.rivets');
    }
  };

  rivets.binders.src = function(el, value) {
    return el.src = value;
  };

  rivets.configure({
    prefix: "rv",
    templateDelimiters: ['{', '}'],
    adapter: {
      subscribe: function(obj, keypath, callback) {
        callback.wrapped = function(m, v) {
          return callback(v);
        };
        return obj.on('change:' + keypath, callback.wrapped);
      },
      unsubscribe: function(obj, keypath, callback) {
        return obj.off('change:' + keypath, callback.wrapped);
      },
      read: function(obj, keypath) {
        if (keypath === "cid") {
          return obj.cid;
        }
        return obj.get(keypath);
      },
      publish: function(obj, keypath, value) {
        if (obj.cid) {
          return obj.set(keypath, value);
        } else {
          return obj[keypath] = value;
        }
      }
    }
  });

  rivets.formatters.getname = function(v) {
    return Formbuilder.fields[v].name;
  };

  rivets.formatters.icon = function(v) {
    return v.replace(/(\/)([^\/]+)$/, '$140_40/$2');
  };

}).call(this);

(function() {
  var BuilderView, EditFieldView, Formbuilder, FormbuilderCollection, FormbuilderModel, ViewFieldView, check_options, show_alert, _ref, _ref1, _ref2, _ref3, _ref4,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FormbuilderModel = (function(_super) {
    __extends(FormbuilderModel, _super);

    function FormbuilderModel() {
      _ref = FormbuilderModel.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FormbuilderModel.prototype.sync = function() {};

    FormbuilderModel.prototype.indexInDOM = function() {
      var $wrapper,
        _this = this;
      $wrapper = $(".fb-field-wrapper").filter((function(_, el) {
        return $(el).data('cid') === _this.cid;
      }));
      return $(".fb-field-wrapper").index($wrapper);
    };

    FormbuilderModel.prototype.is_input = function() {
      return Formbuilder.inputFields[this.get(Formbuilder.options.mappings.FIELD_TYPE)] != null;
    };

    return FormbuilderModel;

  })(Backbone.DeepModel);

  FormbuilderCollection = (function(_super) {
    __extends(FormbuilderCollection, _super);

    function FormbuilderCollection() {
      _ref1 = FormbuilderCollection.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    FormbuilderCollection.prototype.initialize = function() {
      return this.on('add', this.copyCidToModel);
    };

    FormbuilderCollection.prototype.model = FormbuilderModel;

    FormbuilderCollection.prototype.comparator = function(model) {
      return model.indexInDOM();
    };

    FormbuilderCollection.prototype.copyCidToModel = function(model) {
      return model.attributes.cid = model.cid;
    };

    return FormbuilderCollection;

  })(Backbone.Collection);

  ViewFieldView = (function(_super) {
    __extends(ViewFieldView, _super);

    function ViewFieldView() {
      _ref2 = ViewFieldView.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    ViewFieldView.prototype.className = "fb-field-wrapper";

    ViewFieldView.prototype.events = {
      'click .subtemplate-wrapper': 'focusEditView',
      'click .js-duplicate': 'duplicate',
      'click .js-clear': 'clear'
    };

    ViewFieldView.prototype.initialize = function(options) {
      this.parentView = options.parentView;
      this.listenTo(this.model, "change", this.render);
      return this.listenTo(this.model, "destroy", this.remove);
    };

    ViewFieldView.prototype.render = function() {
      this.$el.addClass('response-field-' + this.model.get(Formbuilder.options.mappings.FIELD_TYPE)).removeClass('error').data('cid', this.model.cid).html(Formbuilder.templates["view/base" + (!this.model.is_input() ? '_non_input' : '')]({
        rf: this.model
      }));
      return this;
    };

    ViewFieldView.prototype.focusEditView = function() {
      return this.parentView.createAndShowEditView(this.model);
    };

    ViewFieldView.prototype.clear = function(e) {
      var cb, x,
        _this = this;
      e.preventDefault();
      e.stopPropagation();
      cb = function() {
        _this.parentView.handleFormUpdate();
        return _this.model.destroy();
      };
      x = Formbuilder.options.CLEAR_FIELD_CONFIRM;
      switch (typeof x) {
        case 'string':
          if (confirm(x)) {
            return cb();
          }
          break;
        case 'function':
          return x(cb);
        default:
          return cb();
      }
    };

    ViewFieldView.prototype.duplicate = function() {
      var attrs;
      attrs = $.extend(true, {}, this.model.attributes);
      delete attrs['id'];
      attrs['label'] += ' 复制项';
      return this.parentView.createField(attrs, {
        position: this.model.indexInDOM() + 1
      });
    };

    return ViewFieldView;

  })(Backbone.View);

  EditFieldView = (function(_super) {
    __extends(EditFieldView, _super);

    function EditFieldView() {
      _ref3 = EditFieldView.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    EditFieldView.prototype.className = "edit-response-field";

    EditFieldView.prototype.events = {
      'click .js-add-option': 'addOption',
      'keypress .option-label-input:last, .rows:last>.option-label-input': function(e) {
        var key;
        key = e.keyCode || e.which;
        if (key === 13) {
          return this.addOption(e);
        }
      },
      'click .js-remove-option': 'removeOption',
      'click .js-default-updated': 'defaultUpdated',
      'click .js-go-next': 'goNext',
      'click .js-go-prev': 'goPrev',
      'input .option-label-input': 'forceRender'
    };

    EditFieldView.prototype.initialize = function(options) {
      this.parentView = options.parentView;
      return this.listenTo(this.model, "destroy", this.remove);
    };

    EditFieldView.prototype.render = function() {
      this.$el.html(Formbuilder.templates["edit/base" + (!this.model.is_input() ? '_non_input' : '')]({
        rf: this.model
      }));
      rivets.bind(this.$el, {
        model: this.model
      });
      return this;
    };

    EditFieldView.prototype.remove = function() {
      this.parentView.editView = void 0;
      this.parentView.$el.find("[data-target=\"#addField\"]").click();
      return EditFieldView.__super__.remove.apply(this, arguments);
    };

    EditFieldView.prototype.addOption = function(e) {
      var $el, $ep, action, addCol, addRow, i, newOption, options, triggerEvt;
      $el = $(e.currentTarget);
      $ep = $el.parent();
      addCol = $ep.hasClass('cols');
      addRow = $ep.hasClass('rows');
      if (addCol) {
        options = this.model.get(Formbuilder.options.mappings.COLS) || [];
        newOption = {
          label: ""
        };
      } else if (addRow) {
        options = this.model.get(Formbuilder.options.mappings.ROWS) || [];
        newOption = {
          label: ""
        };
      } else {
        options = this.model.get(Formbuilder.options.mappings.OPTIONS) || [];
        newOption = {
          label: "",
          checked: false
        };
      }
      i = this.$el.find('.option').index($el.closest('.option'));
      if (i > -1) {
        options.splice(i + 1, 0, newOption);
      } else {
        options.push(newOption);
      }
      if (addRow) {
        action = 'ROWS';
        triggerEvt = "change:" + Formbuilder.options.mappings.ROWS;
      } else if (addCol) {
        action = 'COLS';
        triggerEvt = "change:" + Formbuilder.options.mappings.COLS;
      } else {
        action = 'OPTIONS';
        triggerEvt = "change:" + Formbuilder.options.mappings.OPTIONS;
      }
      this.model.set(Formbuilder.options.mappings[action], options);
      this.model.trigger(triggerEvt);
      return this.forceRender();
    };

    EditFieldView.prototype.removeOption = function(e) {
      var $el, $ep, index, isCol, isRow, modelKey, options, selector, triggerEvt;
      $el = $(e.currentTarget);
      $ep = $el.parent();
      isCol = $ep.hasClass('cols');
      isRow = $ep.hasClass('rows');
      if (isRow) {
        selector = ".rows .js-remove-option";
        modelKey = "ROWS";
        triggerEvt = "change:" + Formbuilder.options.mappings.ROWS;
      } else if (isCol) {
        selector = ".cols .js-remove-option";
        modelKey = "COLS";
        triggerEvt = "change:" + Formbuilder.options.mappings.COLS;
      } else {
        selector = ".js-remove-option";
        modelKey = "OPTIONS";
        triggerEvt = "change:" + Formbuilder.options.mappings.OPTIONS;
      }
      index = this.$el.find(selector).index($el);
      options = this.model.get(Formbuilder.options.mappings[modelKey]);
      options.length > 1 && (options.splice(index, 1));
      this.model.set(Formbuilder.options.mappings[modelKey], options);
      this.model.trigger(triggerEvt);
      return this.forceRender();
    };

    EditFieldView.prototype.goPrev = function(e) {
      var $el, $ep, i, isCol, isRow, modelKey, options, selector, triggerEvt;
      $el = $(e.currentTarget);
      $ep = $el.parent();
      isCol = $ep.hasClass('cols');
      isRow = $ep.hasClass('rows');
      if (isRow) {
        selector = ".rows.option";
        modelKey = "ROWS";
        triggerEvt = "change:" + Formbuilder.options.mappings.ROWS;
      } else if (isCol) {
        selector = ".cols.option";
        modelKey = "COLS";
        triggerEvt = "change:" + Formbuilder.options.mappings.COLS;
      } else {
        selector = ".option";
        modelKey = "OPTIONS";
        triggerEvt = "change:" + Formbuilder.options.mappings.OPTIONS;
      }
      i = this.$el.find(selector).index($el.closest('.option'));
      options = this.model.get(Formbuilder.options.mappings[modelKey]) || [];
      if (i > 0) {
        options.splice(i - 1, 0, (options.splice(i, 1))[0]);
        this.model.set(Formbuilder.options.mappings[modelKey], options);
        this.model.trigger(triggerEvt);
        return this.forceRender();
      }
    };

    EditFieldView.prototype.goNext = function(e) {
      var $el, $ep, i, isCol, isRow, modelKey, options, selector, triggerEvt;
      $el = $(e.currentTarget);
      $ep = $el.parent();
      isCol = $ep.hasClass('cols');
      isRow = $ep.hasClass('rows');
      if (isRow) {
        selector = ".rows.option";
        modelKey = "ROWS";
        triggerEvt = "change:" + Formbuilder.options.mappings.ROWS;
      } else if (isCol) {
        selector = ".cols.option";
        modelKey = "COLS";
        triggerEvt = "change:" + Formbuilder.options.mappings.COLS;
      } else {
        selector = ".option";
        modelKey = "OPTIONS";
        triggerEvt = "change:" + Formbuilder.options.mappings.OPTIONS;
      }
      i = this.$el.find(selector).index($el.closest('.option'));
      options = this.model.get(Formbuilder.options.mappings[modelKey]) || [];
      if (i < options.length - 1) {
        options.splice(i + 1, 0, (options.splice(i, 1))[0]);
        this.model.set(Formbuilder.options.mappings[modelKey], options);
        this.model.trigger(triggerEvt);
        return this.forceRender();
      }
    };

    EditFieldView.prototype.upload = function(e) {
      var $el, files;
      $el = $(e.currentTarget);
      files = e.currentTarget.files;
      return $el.fileupload({
        start: function() {
          return console.log('start');
        },
        beforeSend: function(e, data) {
          var _ref4;
          return data.url = (_ref4 = window.G_BASE_URL) != null ? _ref4 : G_BASE_URL + {
            '/?/q/ajax/upload/': '/?/q/ajax/upload/'
          };
        },
        always: function(e, data) {
          if (data.result) {
            return console.log(data.result);
          }
        }
      });
    };

    EditFieldView.prototype.defaultUpdated = function(e) {
      var $el;
      $el = $(e.currentTarget);
      if (!(this.model.get(Formbuilder.options.mappings.FIELD_TYPE) === 'checkboxes' || this.model.get(Formbuilder.options.mappings.FIELD_TYPE) === 'mutiPic')) {
        this.$el.find(".js-default-updated").not($el).attr('checked', false).trigger('change');
      }
      return this.forceRender();
    };

    EditFieldView.prototype.forceRender = function(e) {
      var $el;
      $el = $(this.el);
      $el.find('.fb-bottom-add').size() && $el.find('.fb-bottom-add').toggle(!this.model.get(Formbuilder.options.mappings.OPTIONS).length);
      return this.model.trigger('change');
    };

    return EditFieldView;

  })(Backbone.View);

  BuilderView = (function(_super) {
    __extends(BuilderView, _super);

    function BuilderView() {
      _ref4 = BuilderView.__super__.constructor.apply(this, arguments);
      return _ref4;
    }

    BuilderView.prototype.SUBVIEWS = [];

    BuilderView.prototype.events = {
      'click .js-save-form': 'saveForm',
      'click .fb-tabs a': 'showTab',
      'click .fb-add-field-types a': 'addField',
      'mouseover .fb-add-field-types': 'lockLeftWrapper',
      'mouseout .fb-add-field-types': 'unlockLeftWrapper',
      'input #title': 'forceRender',
      'input #cnt1': 'forceRender'
    };

    BuilderView.prototype.initialize = function(options) {
      var callback, content, endtime, fields, islogin, selector, starttime, title;
      selector = options.selector, this.formBuilder = options.formBuilder, this.bootstrapData = options.bootstrapData, callback = options.callback;
      if (selector != null) {
        this.setElement($(selector));
      }
      this.collection = new FormbuilderCollection;
      this.collection.bind('add', this.addOne, this);
      this.collection.bind('reset', this.reset, this);
      this.collection.bind('change', this.handleFormUpdate, this);
      this.collection.bind('destroy add reset', this.hideShowNoResponseFields, this);
      this.collection.bind('destroy', this.ensureEditViewScrolled, this);
      title = this.bootstrapData.title;
      content = this.bootstrapData.content;
      fields = this.bootstrapData.fields;
      starttime = this.bootstrapData.starttime;
      endtime = this.bootstrapData.endtime;
      islogin = this.bootstrapData.islogin || false;
      this.render();
      this.collection.reset(fields);
      $('input[name=title]').val(title);
      $('textarea[name=content]').text(content);
      $('#start_date').val(starttime);
      $('#end_date').val(endtime);
      $('#islogin').prop('checked', !!islogin);
      _.isFunction(callback) && callback(this);
      this.bindSaveEvent();
      return this.getDateFromStr = options.getDateFromStr || function(str) {
        return (new Date(str)).getTime();
      };
    };

    BuilderView.prototype.bindSaveEvent = function() {
      var _this = this;
      this.formSaved = false;
      this.saveFormButton = this.$el.find(".js-save-form");
      this.saveFormButton.attr('disabled', false).text(Formbuilder.options.dict.SAVE_FORM);
      if (!!Formbuilder.options.AUTOSAVE) {
        setInterval(function() {
          return _this.saveForm.call(_this);
        }, 5000);
      }
      return $(window).bind('beforeunload', function() {
        if (_this.formSaved) {
          return void 0;
        } else {
          return Formbuilder.options.dict.UNSAVED_CHANGES;
        }
      });
    };

    BuilderView.prototype.reset = function() {
      this.$responseFields.html('');
      return this.addAll();
    };

    BuilderView.prototype.render = function() {
      var subview, _i, _len, _ref5;
      this.$el.html(Formbuilder.templates['page']());
      this.$fbLeft = this.$el.find('.fb-left');
      this.$fbRight = this.$el.find('.fb-right');
      this.$responseFields = this.$el.find('.fb-response-fields');
      this.bindWindowScrollEvent();
      this.hideShowNoResponseFields();
      _ref5 = this.SUBVIEWS;
      for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
        subview = _ref5[_i];
        new subview({
          parentView: this
        }).render();
      }
      return this;
    };

    BuilderView.prototype.bindWindowScrollEvent = function() {
      var _this = this;
      return $(window).on('scroll , resize', function() {
        var maxMargin, newMargin;
        newMargin = Math.max(0, $(window).scrollTop() - _this.$el.offset().top);
        maxMargin = _this.$fbRight.height();
        return _this.$fbLeft.css({
          'margin-top': Math.min(maxMargin, newMargin)
        });
      });
    };

    BuilderView.prototype.showTab = function(e) {
      var $el, first_model, target;
      $el = $(e.currentTarget);
      target = $el.data('target');
      $el.closest('li').addClass('active').siblings('li').removeClass('active');
      $(target).addClass('active').siblings('.fb-tab-pane').removeClass('active');
      if (target !== '#editField') {
        this.unlockLeftWrapper();
      }
      if (target === '#editField' && !this.editView && (first_model = this.collection.models[0])) {
        return this.createAndShowEditView(first_model);
      }
    };

    BuilderView.prototype.addOne = function(responseField, _, options) {
      var $replacePosition, view;
      view = new ViewFieldView({
        model: responseField,
        parentView: this
      });
      if (options.$replaceEl != null) {
        return options.$replaceEl.replaceWith(view.render().el);
      } else if ((options.position == null) || options.position === -1) {
        return this.$responseFields.append(view.render().el);
      } else if (options.position === 0) {
        return this.$responseFields.prepend(view.render().el);
      } else if (($replacePosition = this.$responseFields.find(".fb-field-wrapper").eq(options.position))[0]) {
        return $replacePosition.before(view.render().el);
      } else {
        return this.$responseFields.append(view.render().el);
      }
    };

    BuilderView.prototype.setSortable = function() {
      var _this = this;
      if (this.$responseFields.hasClass('ui-sortable')) {
        this.$responseFields.sortable('destroy');
      }
      this.$responseFields.sortable({
        forcePlaceholderSize: true,
        placeholder: 'sortable-placeholder',
        stop: function(e, ui) {
          var rf;
          if (ui.item.data('field-type')) {
            rf = _this.collection.create(Formbuilder.helpers.defaultFieldAttrs(ui.item.data('field-type')), {
              $replaceEl: ui.item
            });
            _this.createAndShowEditView(rf);
          }
          _this.handleFormUpdate();
          return true;
        },
        update: function(e, ui) {
          if (!ui.item.data('field-type')) {
            return _this.ensureEditViewScrolled();
          }
        }
      });
      return this.setDraggable();
    };

    BuilderView.prototype.setDraggable = function() {
      var $addFieldButtons,
        _this = this;
      $addFieldButtons = this.$el.find("[data-field-type]");
      return $addFieldButtons.draggable({
        connectToSortable: this.$responseFields,
        helper: function() {
          var $helper;
          $helper = $("<div class='response-field-draggable-helper' />");
          $helper.css({
            width: _this.$responseFields.width(),
            height: '80px'
          });
          return $helper;
        }
      });
    };

    BuilderView.prototype.addAll = function() {
      this.collection.each(this.addOne, this);
      return this.setSortable();
    };

    BuilderView.prototype.hideShowNoResponseFields = function() {
      return this.$el.find(".fb-no-response-fields")[this.collection.length > 0 ? 'hide' : 'show']();
    };

    BuilderView.prototype.addField = function(e) {
      var field_type;
      field_type = $(e.currentTarget).data('field-type');
      return this.createField(Formbuilder.helpers.defaultFieldAttrs(field_type));
    };

    BuilderView.prototype.createField = function(attrs, options) {
      var rf;
      rf = this.collection.create(attrs, options);
      this.createAndShowEditView(rf);
      return this.handleFormUpdate();
    };

    BuilderView.prototype.createAndShowEditView = function(model) {
      var $el, $newEditEl, $responseFieldEl, self;
      self = this;
      $responseFieldEl = this.$el.find(".fb-field-wrapper").filter(function() {
        return $(this).data('cid') === model.cid;
      });
      $responseFieldEl.addClass('editing').siblings('.fb-field-wrapper').removeClass('editing');
      if (this.editView) {
        if (this.editView.model.cid === model.cid) {
          this.$el.find(".fb-tabs a[data-target=\"#editField\"]").click();
          this.scrollLeftWrapper($responseFieldEl);
          return;
        }
        this.editView.remove();
      }
      this.editView = new EditFieldView({
        model: model,
        parentView: this
      });
      $newEditEl = this.editView.render().$el;
      this.$el.find(".fb-edit-field-wrapper").html($newEditEl);
      this.$el.find(".fb-tabs a[data-target=\"#editField\"]").click();
      $el = $('#upload-file-muti');
      $el && $el.fileupload({
        fileInput: $el.find('file').get(0),
        start: function() {},
        beforeSend: function(e, data) {
          return data.url = window.G_BASE_URL ? G_BASE_URL + '/q/ajax/upload/' : '/q/ajax/upload/';
        },
        always: function(e, data) {
          var baseUrl, newOption, options;
          baseUrl = window.G_BASE_URL ? G_BASE_URL.replace(/\?/, '') : '';
          if (data.result && data.result.code === 0) {
            options = model.get(Formbuilder.options.mappings.OPTIONS) || [];
            newOption = {
              label: "",
              checked: false,
              uri: data.result.data.url,
              thumb: data.result.data.url.replace(/(\/)([^\/]+)$/, '$1100_100/$2')
            };
            options.push(newOption);
            model.set(Formbuilder.options.mappings.OPTIONS, options);
            model.trigger('change:' + Formbuilder.options.mappings.OPTIONS);
            model.trigger('change');
            return self.forceRender();
          }
        }
      });
      return this;
    };

    BuilderView.prototype.mode_error = function(m, e) {
      var $error_parent, $wrapper;
      $wrapper = this.$el.find(".fb-field-wrapper").filter(function() {
        return $(this).data('cid') === m.cid;
      });
      $wrapper.addClass('error');
      $error_parent = $wrapper.find('.cover').siblings('label');
      if ($error_parent.find('.errormsg').size()) {
        return $error_parent.find('.errormsg').html(e);
      } else {
        if (e) {
          return $error_parent.append('<span class="errormsg">' + e + '</span>');
        }
      }
    };

    BuilderView.prototype.ensureEditViewScrolled = function() {
      if (!this.editView) {
        return;
      }
      return this.scrollLeftWrapper($(".fb-field-wrapper.editing"));
    };

    BuilderView.prototype.scrollLeftWrapper = function($responseFieldEl) {
      var _this = this;
      this.unlockLeftWrapper();
      if (!$responseFieldEl[0]) {
        return;
      }
      return $.scrollWindowTo((this.$el.offset().top + $responseFieldEl.offset().top) - this.$responseFields.offset().top, 200, function() {
        return _this.lockLeftWrapper();
      });
    };

    BuilderView.prototype.lockLeftWrapper = function() {};

    BuilderView.prototype.unlockLeftWrapper = function() {
      return this.$fbLeft.data('locked', false);
    };

    BuilderView.prototype.forceRender = function() {
      return this.collection.trigger('change');
    };

    BuilderView.prototype.handleFormUpdate = function() {
      if (this.updatingBatch) {
        return;
      }
      this.formSaved = false;
      return this.saveFormButton.removeAttr('disabled').text(Formbuilder.options.dict.SAVE_FORM);
    };

    BuilderView.prototype.saveForm = function(e) {
      var check_result, content, end_date, first, islogin, item, payload, start_date, title, _i, _len;
      if (this.formSaved) {
        return;
      }
      title = $('input[name=title]');
      content = $('textarea[name=content]').val();
      start_date = $('#start_date');
      end_date = $('#end_date');
      islogin = $('#islogin').prop('checked');
      if (title.val() === '') {
        $('a[data-target="#baseField"]').trigger('click');
        show_alert('问卷标题不能为空');
        title.addClass('error').focus();
        return 0;
      }
      if (start_date.val() === '') {
        $('a[data-target="#baseField"]').trigger('click');
        show_alert('请填写问卷开始时间');
        start_date.focus();
        start_date.parents('.input-group').addClass('has-error');
        return 0;
      }
      if (end_date.val() === '') {
        $('a[data-target="#baseField"]').trigger('click');
        show_alert('请填写问卷结束时间');
        end_date.focus();
        end_date.parents('.input-group').addClass('has-error');
        return 0;
      }
      if ((this.getDateFromStr(end_date.val())) <= (this.getDateFromStr(start_date.val()))) {
        $('a[data-target="#baseField"]').trigger('click');
        show_alert('结束时间必须晚于开始时间');
        end_date.focus();
        end_date.parents('.input-group').addClass('has-error');
        return 0;
      }
      if ((_.filter(this.collection.models, function(a) {
        return a.attributes.field_type !== 'section_break';
      })).length === 0) {
        show_alert('您一个题目都还没添加哦~');
        return 0;
      }
      check_result = check_options(this.collection.models);
      if (check_result !== true) {
        for (_i = 0, _len = check_result.length; _i < _len; _i++) {
          item = check_result[_i];
          this.mode_error((first ? item.mod : first = item.mod), item.msg);
        }
        this.createAndShowEditView(first);
        return 0;
      }
      this.collection.sort();
      payload = JSON.stringify({
        title: title.val(),
        content: content,
        starttime: start_date.val(),
        endtime: end_date.val(),
        islogin: islogin - 0,
        fields: this.collection.toJSON()
      });
      if (Formbuilder.options.HTTP_ENDPOINT) {
        this.doAjaxSave(payload);
      }
      this.formBuilder.trigger('save', payload);
      return this.updateFormButton('saving');
    };

    BuilderView.prototype.updateFormButton = function(s) {
      if (s === 'saving') {
        this.formSaved = true;
        this.saveFormButton.attr('disabled', true).text(Formbuilder.options.dict.SAVEING);
      }
      if (s === 'saved') {
        this.formSaved = true;
        this.saveFormButton.attr('disabled', true).text(Formbuilder.options.dict.ALL_CHANGES_SAVED);
      }
      if (s === 'ready') {
        this.formSaved = false;
        return this.saveFormButton.attr('disabled', false).text(Formbuilder.options.dict.SAVE_FORM);
      }
    };

    BuilderView.prototype.doAjaxSave = function(payload) {
      var _this = this;
      return $.ajax({
        url: Formbuilder.options.HTTP_ENDPOINT,
        type: Formbuilder.options.HTTP_METHOD,
        data: payload,
        contentType: "application/json",
        success: function(data) {
          var datum, _i, _len, _ref5;
          _this.updatingBatch = true;
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            datum = data[_i];
            if ((_ref5 = _this.collection.get(datum.cid)) != null) {
              _ref5.set({
                id: datum.id
              });
            }
            _this.collection.trigger('sync');
          }
          return _this.updatingBatch = void 0;
        }
      });
    };

    return BuilderView;

  })(Backbone.View);

  Formbuilder = (function() {
    Formbuilder.helpers = {
      defaultFieldAttrs: function(field_type) {
        var attrs, _base;
        attrs = {};
        attrs[Formbuilder.options.mappings.LABEL] = '';
        attrs[Formbuilder.options.mappings.FIELD_TYPE] = field_type;
        attrs[Formbuilder.options.mappings.REQUIRED] = true;
        attrs['field_options'] = {};
        return (typeof (_base = Formbuilder.fields[field_type]).defaultAttributes === "function" ? _base.defaultAttributes(attrs) : void 0) || attrs;
      },
      simple_format: function(x) {
        return x != null ? x.replace(/\n/g, '<br />') : void 0;
      }
    };

    Formbuilder.options = {
      BUTTON_CLASS: 'btn btn-primary btn-lg',
      BUTTON_CLASS_XS: 'btn btn-primary btn-xs',
      BUTTON_CLASS_SM: 'btn btn-primary btn-sm',
      CHOICE_BUTTON: 'choice',
      HTTP_ENDPOINT: '',
      HTTP_METHOD: 'POST',
      AUTOSAVE: false,
      CLEAR_FIELD_CONFIRM: false,
      mappings: {
        SIZE: 'field_options.size',
        UNITS: 'field_options.units',
        LABEL: 'label',
        FIELD_TYPE: 'field_type',
        REQUIRED: 'required',
        ADMIN_ONLY: 'admin_only',
        OPTIONS: 'field_options.options',
        ROWS: 'field_options.rows',
        COLS: 'field_options.cols',
        DESCRIPTION: 'field_options.description',
        INCLUDE_OTHER: 'field_options.include_other_option',
        INCLUDE_BLANK: 'field_options.include_blank_option',
        INTEGER_ONLY: 'field_options.integer_only',
        MIN: 'field_options.min',
        MAX: 'field_options.max',
        MINLENGTH: 'field_options.minlength',
        MAXLENGTH: 'field_options.maxlength',
        LENGTH_UNITS: 'field_options.min_max_length_units'
      },
      dict: {
        ALL_CHANGES_SAVED: '问卷已发布',
        SAVEING: '正在发布...',
        SAVE_FORM: '发布',
        UNSAVED_CHANGES: '你还没有发布你的问卷，确定要离开？离开问卷数据将丢失。'
      }
    };

    Formbuilder.fields = {};

    Formbuilder.inputFields = {};

    Formbuilder.nonInputFields = {};

    Formbuilder.registerField = function(name, opts) {
      var x, _i, _len, _ref5;
      _ref5 = ['view', 'edit', 'other'];
      for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
        x = _ref5[_i];
        opts[x] = _.template(opts[x]);
      }
      opts.field_type = name;
      Formbuilder.fields[name] = opts;
      if (opts.type === 'non_input') {
        return Formbuilder.nonInputFields[name] = opts;
      } else {
        return Formbuilder.inputFields[name] = opts;
      }
    };

    function Formbuilder(opts) {
      var args;
      if (opts == null) {
        opts = {};
      }
      _.extend(this, Backbone.Events);
      args = _.extend(opts, {
        formBuilder: this
      });
      this.mainView = new BuilderView(args);
    }

    return Formbuilder;

  })();

  window.Formbuilder = Formbuilder;

  show_alert = function(m) {
    if (AWS) {
      return AWS.alert(m);
    } else {
      return alert(m);
    }
  };

  check_options = function(opts) {
    var fieldtype, has, item, itemlength, labels, msg, o, opt, r, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _m, _n, _ref5, _ref6, _ref7, _ref8, _ref9;
    r = [];
    for (_i = 0, _len = opts.length; _i < _len; _i++) {
      opt = opts[_i];
      msg = [];
      fieldtype = opt.attributes.field_type;
      if (fieldtype !== 'section_break') {
        if (opt.attributes.label === '') {
          msg.push('标题不能为空');
        }
      }
      if (fieldtype === 'radio' || fieldtype === 'checkboxes' || fieldtype === 'singlePic' || fieldtype === 'mutiPic') {
        has = false;
        _ref5 = opt.attributes.field_options.options;
        for (_j = 0, _len1 = _ref5.length; _j < _len1; _j++) {
          o = _ref5[_j];
          if (o.label !== '') {
            has = true;
          }
        }
        if (!has) {
          msg.push(' 至少要填一个选项');
        }
      }
      if (opt.attributes.field_options.max && opt.attributes.field_options.min) {
        if (+opt.attributes.field_options.min > +opt.attributes.field_options.max) {
          msg.push('最多选项数不能小于最小选项数');
        }
      }
      if (opt.attributes.field_options.maxlength && opt.attributes.field_options.minlength) {
        if (+opt.attributes.field_options.minlength > +opt.attributes.field_options.maxlength) {
          msg.push('最大字符数不能小于最小字符数');
        }
      }
      if (fieldtype === 'checkboxes' && opt.attributes.field_options.min) {
        itemlength = opt.attributes.field_options.options.length;
        if (opt.attributes.field_options.include_other_option) {
          itemlength++;
        }
        if (itemlength < +opt.attributes.field_options.min) {
          msg.push('选项数少于最小选项数');
        }
      }
      if (opt.attributes.field_options.options && opt.attributes.field_options.options.length) {
        labels = [];
        _ref6 = opt.attributes.field_options.options;
        for (_k = 0, _len2 = _ref6.length; _k < _len2; _k++) {
          item = _ref6[_k];
          if (labels.indexOf(item.label) > -1) {
            msg.push('选项重复');
            break;
          }
          labels.push(item.label);
        }
        _ref7 = opt.attributes.field_options.options;
        for (_l = 0, _len3 = _ref7.length; _l < _len3; _l++) {
          item = _ref7[_l];
          if (item.label === '') {
            msg.push('选项不能为空');
            break;
          }
        }
      }
      if (fieldtype === 'singleMatrix' || fieldtype === 'mutiMatrix') {
        _ref8 = opt.attributes.field_options.rows;
        for (_m = 0, _len4 = _ref8.length; _m < _len4; _m++) {
          item = _ref8[_m];
          if (item.label === '') {
            msg.push('行标题不能为空');
            break;
          }
        }
        _ref9 = opt.attributes.field_options.cols;
        for (_n = 0, _len5 = _ref9.length; _n < _len5; _n++) {
          item = _ref9[_n];
          if (item.label === '') {
            msg.push('列标题不能为空');
            break;
          }
        }
      }
      if (msg.length) {
        r.push({
          mod: opt,
          msg: '(' + msg.join(' , ') + ')'
        });
      }
    }
    if (r.length) {
      return r;
    } else {
      return true;
    }
  };

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Formbuilder;
  } else {
    window.Formbuilder = Formbuilder;
  }

}).call(this);

(function() {
  Formbuilder.registerField('checkboxes', {
    order: 10,
    name: '多选题',
    view: "<% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n  <div>\n    <label class='fb-option'>\n      <input type='checkbox' <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %> onclick=\"javascript: return false;\" />\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </label>\n  </div>\n<% } %>\n\n<% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>\n  <div class='other-option'>\n    <label class='fb-option'>\n      <input type='checkbox' />\n      其它\n    </label>\n\n    <input type='text' />\n  </div>\n<% } %>",
    edit: "<%= Formbuilder.templates['edit/options']({ includeOther: true,rf: rf }) %>",
    other: "<%= Formbuilder.templates['edit/min_max']() %>",
    addButton: "<span class=\"symbol\"><span class=\"fa fa-square-o\"></span></span> 多选题",
    defaultAttributes: function(attrs) {
      attrs.field_options.options = [
        {
          label: "",
          checked: false
        }, {
          label: "",
          checked: false
        }
      ];
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('dropdown', {
    order: 20,
    name: '下拉题',
    view: "<select>\n  <% if (rf.get(Formbuilder.options.mappings.INCLUDE_BLANK)) { %>\n    <option value=''></option>\n  <% } %>\n\n  <% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n    <option <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'selected' %>>\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </option>\n  <% } %>\n</select>",
    edit: "<%= Formbuilder.templates['edit/options']({ includeBlank: true, rf: rf }) %>",
    other: "",
    addButton: "<span class=\"symbol\"><span class=\"fa fa-caret-down\"></span></span> 下拉题",
    defaultAttributes: function(attrs) {
      attrs.field_options.options = [
        {
          label: "",
          checked: false
        }, {
          label: "",
          checked: false
        }
      ];
      attrs.field_options.include_blank_option = false;
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('mutiMatrix', {
    order: 55,
    name: '矩阵多选题',
    view: "<table class='table table-bordered'>\n  <thead>\n    <tr>\n      <th>&nbsp;</th>\n      <% for (i in (rf.get(Formbuilder.options.mappings.COLS) || [])) { %>\n      <th><%= rf.get(Formbuilder.options.mappings.COLS)[i].label%></th>\n      <% } %>\n    </tr>\n  <tbody>\n  <% for (i in (rf.get(Formbuilder.options.mappings.ROWS) || [])) { %>\n  <tr>\n    <td><%= rf.get(Formbuilder.options.mappings.ROWS)[i].label%></td>\n    <% for (j in (rf.get(Formbuilder.options.mappings.COLS) || [])) { %>\n    <td><input type='checkbox' /></td>\n    <% } %>\n  </tr>\n  <% } %>\n  </tbody>\n</table>    ",
    edit: "<%= Formbuilder.templates['edit/matrix']({ rf: rf }) %>",
    other: "",
    addButton: "<span class=\"symbol\"><span class=\"glyphicon glyphicon-th\"></span></span> 矩阵多选题",
    defaultAttributes: function(attrs) {
      attrs.field_options.rows = [
        {
          label: ""
        }, {
          label: ""
        }
      ];
      attrs.field_options.cols = [
        {
          label: ""
        }, {
          label: ""
        }
      ];
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('mutiPic', {
    order: 65,
    name: '图片多选题',
    view: "<div class=\"pic_list\">\n<% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n  <div class=\"col-xs-3\">\n    <label class='fb-option'>\n      <div><img src=\"<%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].thumb %>\" /></div>\n      <input type='checkbox' <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %> onclick=\"javascript: return false;\" />\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </label>\n  </div>\n<% } %>\n</div>",
    edit: "<%= Formbuilder.templates['edit/pic']({ rf: rf }) %>",
    other: "<%= Formbuilder.templates['edit/min_max']() %>",
    addButton: "<span class=\"symbol\"><span class=\"glyphicon glyphicon-picture\"></span></span> 图片多选题",
    defaultAttributes: function(attrs) {
      attrs.field_options.options = [];
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('mutitext', {
    order: 40,
    name: '简答题',
    view: "<textarea class='rf-size-medium' />",
    edit: "",
    other: "<%= Formbuilder.templates['edit/min_max_length']() %>",
    addButton: "<span class='symbol'>&#182;</span> 简答题",
    defaultAttributes: function(attrs) {
      attrs[Formbuilder.options.mappings.REQUIRED] = false;
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('radio', {
    order: 0,
    name: '单选题',
    view: "<% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n  <div>\n    <label class='fb-option'>\n      <input type='radio' <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %> onclick=\"javascript: return false;\" />\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </label>\n  </div>\n<% } %>\n\n<% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>\n  <div class='other-option'>\n    <label class='fb-option'>\n      <input type='radio' />\n      其他\n    </label>\n\n    <input type='text' />\n  </div>\n<% } %>",
    edit: "<%= Formbuilder.templates['edit/options']({ includeOther: true, rf: rf }) %>",
    other: "",
    addButton: "<span class=\"symbol\"><span class=\"fa fa-circle-o\"></span></span> 单选题",
    defaultAttributes: function(attrs) {
      attrs.field_options.options = [
        {
          label: "",
          checked: false
        }, {
          label: "",
          checked: false
        }
      ];
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('singleMatrix', {
    order: 50,
    name: '矩阵单选题',
    view: "<table class='table table-bordered'>\n  <thead>\n    <tr>\n      <th>&nbsp;</th>\n      <% for (i in (rf.get(Formbuilder.options.mappings.COLS) || [])) { %>\n      <th><%= rf.get(Formbuilder.options.mappings.COLS)[i].label%></th>\n      <% } %>\n    </tr>\n  <tbody>\n  <% for (i in (rf.get(Formbuilder.options.mappings.ROWS) || [])) { %>\n  <tr>\n    <td><%= rf.get(Formbuilder.options.mappings.ROWS)[i].label%></td>\n    <% for (j in (rf.get(Formbuilder.options.mappings.COLS) || [])) { %>\n    <td><input type='radio' /></td>\n    <% } %>\n  </tr>\n  <% } %>\n  </tbody>\n</table>    ",
    edit: "<%= Formbuilder.templates['edit/matrix']({ rf: rf }) %>",
    other: "",
    addButton: "<span class=\"symbol\"><span class=\"glyphicon glyphicon-th\"></span></span> 矩阵单选题",
    defaultAttributes: function(attrs) {
      attrs.field_options.rows = [
        {
          label: ""
        }, {
          label: ""
        }
      ];
      attrs.field_options.cols = [
        {
          label: ""
        }, {
          label: ""
        }
      ];
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('singlePic', {
    order: 60,
    name: '图片单选题',
    view: "<div class=\"pic_list\">\n<% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n  <div class=\"col-xs-3\">\n    <label class='fb-option'>\n      <div><img src=\"<%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].thumb %>\" /></div>\n      <input type='radio' <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %> onclick=\"javascript: return false;\" />\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </label>\n  </div>\n<% } %>\n</div>",
    edit: "<%= Formbuilder.templates['edit/pic']({ rf: rf }) %>",
    other: "",
    addButton: "<span class=\"symbol\"><span class=\"glyphicon glyphicon-picture\"></span></span> 图片单选题",
    defaultAttributes: function(attrs) {
      attrs.field_options.options = [];
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('text', {
    order: 30,
    name: '填空题',
    view: "<input type='text' class='rf-size-medium' />",
    edit: "",
    other: "<%= Formbuilder.templates['edit/min_max_length']() %>",
    addButton: "<span class='symbol'><span class='fa fa-font'></span></span> 填空题",
    defaultAttributes: function(attrs) {
      attrs[Formbuilder.options.mappings.REQUIRED] = false;
      return attrs;
    }
  });

}).call(this);

this["Formbuilder"] = this["Formbuilder"] || {};
this["Formbuilder"]["templates"] = this["Formbuilder"]["templates"] || {};

this["Formbuilder"]["templates"]["edit/base"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<!-- ' +
((__t = ( Formbuilder.templates['edit/base_header']() )) == null ? '' : __t) +
' -->\r\n' +
((__t = ( Formbuilder.templates['edit/common']() )) == null ? '' : __t) +
'\r\n' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].edit({rf: rf}) )) == null ? '' : __t) +
'\r\n<div class=\'fb-edit-section-header\'>校验</div>\r\n<div class=\'fb-common-wrapper\'>\r\n  <div class=\'fb-common-checkboxes\'>\r\n    ' +
((__t = ( Formbuilder.templates['edit/checkboxes']() )) == null ? '' : __t) +
'\r\n  </div>\r\n  ' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].other() )) == null ? '' : __t) +
'\r\n  <div class=\'fb-clear\'></div>\r\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/base_header"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-field-label\'>\r\n  <span>简介</span>\r\n  <code class=\'field-type\' data-rv-text=\'model.' +
((__t = ( Formbuilder.options.mappings.FIELD_TYPE )) == null ? '' : __t) +
' | getname\'></code>\r\n  <span class=\'fa fa-arrow-right pull-right\'></span>\r\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/base_non_input"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p +=
((__t = ( Formbuilder.templates['edit/base_header']() )) == null ? '' : __t) +
'\r\n' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].edit({rf: rf}) )) == null ? '' : __t) +
'\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/checkboxes"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<label>\r\n  <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.REQUIRED )) == null ? '' : __t) +
'\' />\r\n  必答题\r\n</label>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/common"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\' data-rv-text=\'model.' +
((__t = ( Formbuilder.options.mappings.FIELD_TYPE )) == null ? '' : __t) +
' | getname\'></div>\r\n\r\n<div class=\'fb-common-wrapper\'>\r\n  <div class=\'fb-label-description\'>\r\n    ' +
((__t = ( Formbuilder.templates['edit/label_description']() )) == null ? '' : __t) +
'\r\n  </div>\r\n  <div class=\'fb-clear\'></div>\r\n</div>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/integer_only"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>属性</div>\r\n<label>\r\n  <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INTEGER_ONLY )) == null ? '' : __t) +
'\' />\r\n  只接受数字\r\n</label>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/label_description"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<input type=\'text\' data-rv-input=\'model.' +
((__t = ( Formbuilder.options.mappings.LABEL )) == null ? '' : __t) +
'\' placeholder="题目" />\r\n<textarea data-rv-input=\'model.' +
((__t = ( Formbuilder.options.mappings.DESCRIPTION )) == null ? '' : __t) +
'\'\r\n  placeholder=\'添加一个描述\'></textarea>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/matrix"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div>行标题</div>\r\n\r\n<div class=\'option rows\' data-rv-each-rows=\'model.' +
((__t = ( Formbuilder.options.mappings.ROWS )) == null ? '' : __t) +
'\'>\r\n  <input type="text" data-rv-input="rows:label" class=\'option-label-input\' />\r\n  <a class="js-add-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS_SM )) == null ? '' : __t) +
'" title="添加新选项"><i class=\'fa fa-plus-circle\'></i></a>\r\n  <a class="js-remove-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS_SM )) == null ? '' : __t) +
'" title="删除选项"><i class=\'fa fa-minus-circle\'></i></a>\r\n  <a class="js-go-next ' +
((__t = ( Formbuilder.options.BUTTON_CLASS_SM )) == null ? '' : __t) +
'" title="下移"><i class="glyphicon glyphicon-arrow-down"></i></a>\r\n  <a class="js-go-prev ' +
((__t = ( Formbuilder.options.BUTTON_CLASS_SM )) == null ? '' : __t) +
'" title="上移"><i class="glyphicon glyphicon-arrow-up"></i></a>\r\n</div>\r\n\r\n<div>列标题</div>\r\n\r\n<div class=\'option cols\' data-rv-each-cols=\'model.' +
((__t = ( Formbuilder.options.mappings.COLS )) == null ? '' : __t) +
'\'>\r\n  <input type="text" data-rv-input="cols:label" class=\'option-label-input\' />\r\n  <a class="js-add-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS_SM )) == null ? '' : __t) +
'" title="添加新选项"><i class=\'fa fa-plus-circle\'></i></a>\r\n  <a class="js-remove-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS_SM )) == null ? '' : __t) +
'" title="删除选项"><i class=\'fa fa-minus-circle\'></i></a>\r\n  <a class="js-go-next ' +
((__t = ( Formbuilder.options.BUTTON_CLASS_SM )) == null ? '' : __t) +
'" title="下移"><i class="glyphicon glyphicon-arrow-down"></i></a>\r\n  <a class="js-go-prev ' +
((__t = ( Formbuilder.options.BUTTON_CLASS_SM )) == null ? '' : __t) +
'" title="上移"><i class="glyphicon glyphicon-arrow-up"></i></a>\r\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/min_max"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<!-- <div class=\'fb-edit-section-header\'>范围设置</div> -->\r\n\r\n最少选\r\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MIN )) == null ? '' : __t) +
'" style="width: 30px" />\r\n项\r\n&nbsp;&nbsp;\r\n最多选\r\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MAX )) == null ? '' : __t) +
'" style="width: 30px" />\r\n项\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/min_max_length"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<!-- <div class=\'fb-edit-section-header\'>长度限制</div> -->\r\n\r\n最少\r\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MINLENGTH )) == null ? '' : __t) +
'" style="width: 30px" /> 个字\r\n&nbsp;&nbsp;\r\n最多\r\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MAXLENGTH )) == null ? '' : __t) +
'" style="width: 30px" /> 个字\r\n\r\n<!-- <select data-rv-value="model.' +
((__t = ( Formbuilder.options.mappings.LENGTH_UNITS )) == null ? '' : __t) +
'" style="width: auto;">\r\n  <option value="characters">字符</option>\r\n  <option value="words">字</option>\r\n</select> -->\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/options"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div>选项</div>\r\n\r\n';
 if (typeof includeBlank !== 'undefined'){ ;
__p += '\r\n  <label>\r\n    <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_BLANK )) == null ? '' : __t) +
'\' />\r\n    包含空选项\r\n  </label>\r\n';
 } ;
__p += '\r\n\r\n<div class=\'option\' data-rv-each-option=\'model.' +
((__t = ( Formbuilder.options.mappings.OPTIONS )) == null ? '' : __t) +
'\'>\r\n  <input type="checkbox" class=\'js-default-updated\' data-rv-checked="option:checked" />\r\n  <input type="text" data-rv-input="option:label" class=\'option-label-input\' />\r\n  <a class="js-add-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS_SM )) == null ? '' : __t) +
'" title="添加新选项"><i class=\'fa fa-plus-circle\'></i></a>\r\n  <a class="js-remove-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS_SM )) == null ? '' : __t) +
'" title="删除选项"><i class=\'fa fa-minus-circle\'></i></a>\r\n  <a class="js-go-next ' +
((__t = ( Formbuilder.options.BUTTON_CLASS_SM )) == null ? '' : __t) +
'" title="下移"><i class="glyphicon glyphicon-arrow-down"></i></a>\r\n  <a class="js-go-prev ' +
((__t = ( Formbuilder.options.BUTTON_CLASS_SM )) == null ? '' : __t) +
'" title="上移"><i class="glyphicon glyphicon-arrow-up"></i></a>\r\n</div>\r\n\r\n';
 if (typeof includeOther !== 'undefined'){ ;
__p += '\r\n  <label>\r\n    <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_OTHER )) == null ? '' : __t) +
'\' />\r\n    包含其它\r\n  </label>\r\n';
 } ;
__p += '\r\n\r\n<div class=\'fb-bottom-add\' style="display:' +
((__t = ( rf.get(Formbuilder.options.mappings.OPTIONS).length ? " none":"")) == null ? '' : __t) +
';">\r\n  <a class="js-add-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS_SM )) == null ? '' : __t) +
'">添加新选项</a>\r\n</div>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/pic"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div>选项</div>\r\n\r\n<div class=\'option mb-5\' data-rv-each-option=\'model.' +
((__t = ( Formbuilder.options.mappings.OPTIONS )) == null ? '' : __t) +
'\'>\r\n  <input type="checkbox" class=\'js-default-updated\' data-rv-checked="option:checked" />\r\n  <img data-rv-src="option:uri | icon" />\r\n  <input type="text" data-rv-input="option:label" class=\'option-label-input img-label\' />\r\n  <a class="js-remove-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS_SM )) == null ? '' : __t) +
'" title="删除选项"><i class=\'fa fa-minus-circle\'></i></a>\r\n  <a class="js-go-next ' +
((__t = ( Formbuilder.options.BUTTON_CLASS_SM )) == null ? '' : __t) +
'" title="下移"><i class="glyphicon glyphicon-arrow-down"></i></a>\r\n  <a class="js-go-prev ' +
((__t = ( Formbuilder.options.BUTTON_CLASS_SM )) == null ? '' : __t) +
'" title="上移"><i class="glyphicon glyphicon-arrow-up"></i></a>\r\n</div>\r\n\r\n<div class="col-xs-12">\r\n  <form name="file" onsubmit="return false">\r\n  <label class="ace-file-input ace-file-multiple" id="upload-file-muti"><input multiple="" name="upfile" type="file"><span class="ace-file-container" data-title="点击上传图片"><span class="ace-file-name" data-title="No File ..."><i class=" ace-icon ace-icon fa fa-cloud-upload"></i></span></span></label>\r\n  </form>\r\n</div>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/size"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>字体大小</div>\r\n<select data-rv-value="model.' +
((__t = ( Formbuilder.options.mappings.SIZE )) == null ? '' : __t) +
'">\r\n  <option value="small">小</option>\r\n  <option value="medium">中</option>\r\n  <option value="large">大</option>\r\n</select>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/units"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>单位</div>\r\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.UNITS )) == null ? '' : __t) +
'" />\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["page"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p +=
((__t = ( Formbuilder.templates['partials/left_side']() )) == null ? '' : __t) +
'\r\n' +
((__t = ( Formbuilder.templates['partials/right_side']() )) == null ? '' : __t) +
'\r\n<div class=\'fb-clear\'></div>';

}
return __p
};

this["Formbuilder"]["templates"]["partials/add_field"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class=\'fb-tab-pane active\' id=\'addField\'>\r\n  <div class=\'fb-add-field-types\'>\r\n    <div class=\'section\'>\r\n      ';
 _.each(_.sortBy(Formbuilder.inputFields, 'order'), function(f){ ;
__p += '\r\n        <a data-field-type="' +
((__t = ( f.field_type )) == null ? '' : __t) +
'" class="' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
' ' +
((__t = ( Formbuilder.options.CHOICE_BUTTON )) == null ? '' : __t) +
'">\r\n          ' +
((__t = ( f.addButton )) == null ? '' : __t) +
'\r\n        </a>\r\n      ';
 }); ;
__p += '\r\n    </div>\r\n\r\n    <div class=\'section\'>\r\n      ';
 _.each(_.sortBy(Formbuilder.nonInputFields, 'order'), function(f){ ;
__p += '\r\n        <a data-field-type="' +
((__t = ( f.field_type )) == null ? '' : __t) +
'" class="' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
' ' +
((__t = ( Formbuilder.options.CHOICE_BUTTON )) == null ? '' : __t) +
'">\r\n          ' +
((__t = ( f.addButton )) == null ? '' : __t) +
'\r\n        </a>\r\n      ';
 }); ;
__p += '\r\n    </div>\r\n  </div>\r\n</div>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["partials/base_field"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-tab-pane\' id=\'baseField\'>\r\n\t<div class="section base-panel">\r\n\t\t<label for="start_date">开始时间<span class="important">*</span>：</label>\t\t\r\n\t\t<div class="input-group">\r\n\t\t\t<input id="start_date" name="start_date" type="text" class="form-control" placeholder="开始时间">\r\n\t\t\t<span class="input-group-addon">\r\n\t\t\t\t<i class="fa fa-clock-o bigger-110"></i>\r\n\t\t\t</span>\r\n\t\t</div>\r\n\t\t<label>结束时间<span class="important">*</span>：</label>\t\t\r\n\t\t<div class="input-group">\r\n\t\t\t<input id="end_date" name="end_date" type="text" class="form-control" placeholder="结束时间">\r\n\t\t\t<span class="input-group-addon">\r\n\t\t\t\t<i class="fa fa-clock-o bigger-110"></i>\r\n\t\t\t</span>\r\n\t\t</div>\r\n\t\t<div class="row mt-8">\r\n\t\t\t<div class="col-xs-12 form-inline">\r\n\t\t\t\t<div class="form-group">\r\n\t\t\t\t\t<label>\r\n\t\t\t\t\t\t<input id="islogin" name="islogin" class="ce-switch" type="checkbox">\r\n\t\t\t\t\t\t<span class="lbl"></span>\r\n\t\t\t\t\t</label>\r\n\t\t\t\t\t<label class="adjust">答卷需要登录验证</label>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["partials/edit_field"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-tab-pane\' id=\'editField\'>\r\n  <div class=\'fb-edit-field-wrapper\'></div>\r\n</div>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["partials/head"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="question_head">\r\n\t<div id="q_edit_view">\r\n\t\t<div class="question_panel">\r\n\t\t\t<label for="title">问卷标题<span class="important">*</span>：</label>\r\n\t\t\t<div class="head_right"><input type="text" id="title" name="title" class="full" maxlength="100" /></div>\r\n\t\t</div>\r\n\t\t<div class="question_panel">\r\n\t\t\t<label for="cnt1" class="vtop">问卷说明&nbsp;：</label>\r\n\t\t\t<div id="editor" class="head_right"><textarea id="cnt1" name="content" class="editor"></textarea></div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div id="q_see_view" style="display: none">\r\n\t\t\r\n\t</div>\r\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["partials/left_side"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-left\'>\r\n  <ul class=\'fb-tabs\'>\r\n    <li class="active"><a data-target=\'#addField\'>添加题目</a></li>\r\n    <li><a data-target=\'#editField\'>编辑题目</a></li>\r\n    <li><a data-target="#baseField">全局设置</a></li>\r\n  </ul>\r\n\r\n  <div class=\'fb-tab-content\'>\r\n    ' +
((__t = ( Formbuilder.templates['partials/add_field']() )) == null ? '' : __t) +
'\r\n    ' +
((__t = ( Formbuilder.templates['partials/edit_field']() )) == null ? '' : __t) +
'\r\n    ' +
((__t = ( Formbuilder.templates['partials/base_field']() )) == null ? '' : __t) +
'\r\n  </div>\r\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["partials/nav"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="crumbs">\r\n    <a href="?/q/">问卷列表</a> / \r\n    <a href="?/q/my/">我的问卷</a>\r\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["partials/right_side"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-right\'>\r\n  ' +
((__t = ( Formbuilder.templates['partials/head']() )) == null ? '' : __t) +
'\r\n  <div class=\'fb-no-response-fields\'>还没有添加任何题目</div>\r\n  <div class=\'fb-response-fields\'></div>\r\n  ' +
((__t = ( Formbuilder.templates['partials/save_button']() )) == null ? '' : __t) +
'\r\n</div>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["partials/save_button"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-save-wrapper\'>\r\n  <button class=\'js-save-form ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
' col-sm-2 col-sm-offset-5\'></button>\r\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["view/base"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'subtemplate-wrapper\'>\r\n  <div class=\'cover\'></div>\r\n  ' +
((__t = ( Formbuilder.templates['view/label']({rf: rf}) )) == null ? '' : __t) +
'\r\n  ' +
((__t = ( Formbuilder.templates['view/description']({rf: rf}) )) == null ? '' : __t) +
'\r\n  ' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].view({rf: rf}) )) == null ? '' : __t) +
'\r\n\r\n  ' +
((__t = ( Formbuilder.templates['view/duplicate_remove']({rf: rf}) )) == null ? '' : __t) +
'\r\n</div>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/base_non_input"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="subtemplate-wrapper">\r\n\t<div class="cover"></div>\r\n\t' +
((__t = ( Formbuilder.templates['view/duplicate_remove']({rf: rf}) )) == null ? '' : __t) +
'\r\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["view/description"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<span class=\'help-block\'>\r\n  ' +
((__t = ( Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.DESCRIPTION)) )) == null ? '' : __t) +
'\r\n</span>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/duplicate_remove"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'actions-wrapper\'>\r\n  <a class="js-duplicate ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="复制"><i class=\'fa fa-plus-circle\'></i></a>\r\n  <a class="js-clear ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="删除"><i class=\'fa fa-minus-circle\'></i></a>\r\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["view/label"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<label>\r\n  <span>' +
((__t = ( Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.LABEL)) )) == null ? '' : __t) +
'\r\n  ';
 if (rf.get(Formbuilder.options.mappings.REQUIRED)) { ;
__p += '\r\n    <abbr title=\'required\'>*</abbr>\r\n  ';
 } ;
__p += '\r\n</label>\r\n';

}
return __p
};
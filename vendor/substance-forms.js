(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('substance')) :
  typeof define === 'function' && define.amd ? define(['substance'], factory) :
  (factory(global.window.substance));
}(this, (function (substance) { 'use strict';

var ProseEditor = substance.ProseEditorPackage.ProseEditor;




var RichTextAreaEditor = (function (ProseEditor) {
  function RichTextAreaEditor () {
    ProseEditor.apply(this, arguments);
  }

  if ( ProseEditor ) RichTextAreaEditor.__proto__ = ProseEditor;
  RichTextAreaEditor.prototype = Object.create( ProseEditor && ProseEditor.prototype );
  RichTextAreaEditor.prototype.constructor = RichTextAreaEditor;

  RichTextAreaEditor.prototype.didMount = function didMount () {
    
    var scrollPane = this.context.scrollPane;
    var Overlay = this.componentRegistry.get('overlay');
    var Dropzones = this.componentRegistry.get('dropzones');

    this.overlay = new Overlay(this, {
      toolGroups: ['annotations', 'text', 'overlay']
    }).mount(scrollPane.el);

    this.dropzones = new Dropzones(this, {}).mount(scrollPane.el);
  };

  RichTextAreaEditor.prototype.dispose = function dispose () {
    this.overlay.remove();
    this.dropzones.remove();
  };

  RichTextAreaEditor.prototype.render = function render ($$) {
    var el = $$('div').addClass('sc-rich-text-area-editor');
    var configurator = this.getConfigurator();

    el.append(
      $$(substance.ContainerEditor, {
        disabled: this.props.disabled,
        editorSession: this.editorSession,
        node: this.doc.get('body'),
        commands: configurator.getSurfaceCommandNames(),
        textTypes: configurator.getTextTypes()
      }).ref('body')
    );
    return el
  };

  return RichTextAreaEditor;
}(ProseEditor));

var RichTextAreaHTMLImporter = (function (HTMLImporter$$1) {
  function RichTextAreaHTMLImporter () {
    HTMLImporter$$1.apply(this, arguments);
  }

  if ( HTMLImporter$$1 ) RichTextAreaHTMLImporter.__proto__ = HTMLImporter$$1;
  RichTextAreaHTMLImporter.prototype = Object.create( HTMLImporter$$1 && HTMLImporter$$1.prototype );
  RichTextAreaHTMLImporter.prototype.constructor = RichTextAreaHTMLImporter;

  RichTextAreaHTMLImporter.prototype.convertDocument = function convertDocument (documentEl) {
    var bodyEl = documentEl.find('body');
    this.convertContainer(bodyEl.childNodes, 'body');
  };

  return RichTextAreaHTMLImporter;
}(substance.HTMLImporter));

var RichTextAreaHTMLExporter = (function (HTMLExporter$$1) {
  function RichTextAreaHTMLExporter () {
    HTMLExporter$$1.apply(this, arguments);
  }

  if ( HTMLExporter$$1 ) RichTextAreaHTMLExporter.__proto__ = HTMLExporter$$1;
  RichTextAreaHTMLExporter.prototype = Object.create( HTMLExporter$$1 && HTMLExporter$$1.prototype );
  RichTextAreaHTMLExporter.prototype.constructor = RichTextAreaHTMLExporter;

  RichTextAreaHTMLExporter.prototype.convertDocument = function convertDocument (doc) {
    var body = doc.get('body');
    var elements = this.convertContainer(body);
    return elements.map(function (el) {
      return el.outerHTML
    }).join('')
  };

  return RichTextAreaHTMLExporter;
}(substance.HTMLExporter));

var RichTextAreaPackage = {
  name: 'rich-text-area',
  configure: function(config) {
    config.defineSchema({
      name: 'rich-text-area',
      DocumentClass: substance.Document,
      defaultTextType: 'paragraph'
    });

    var defaultOptions = {
      disableCollapsedCursor: true,
      toolGroup: 'overlay'
    };

    config.import(substance.BasePackage, defaultOptions);
    config.import(substance.ParagraphPackage, defaultOptions);

    
    config.addImporter('html', RichTextAreaHTMLImporter);
    config.addExporter('html', RichTextAreaHTMLExporter);
  }
};

var Xref = (function (PropertyAnnotation$$1) {
  function Xref () {
    PropertyAnnotation$$1.apply(this, arguments);
  }if ( PropertyAnnotation$$1 ) Xref.__proto__ = PropertyAnnotation$$1;
  Xref.prototype = Object.create( PropertyAnnotation$$1 && PropertyAnnotation$$1.prototype );
  Xref.prototype.constructor = Xref;

  

  return Xref;
}(substance.PropertyAnnotation));

Xref.define({
  type: 'xref',
  content: { type: 'string', optional: true }
});


Xref.fragmentation = substance.Fragmenter.SHOULD_NOT_SPLIT;

var XrefHTMLConverter = {

  type: 'xref',
  tagName: 'span',

  matchElement: function(el) {
    return el.is('span') && el.attr('data-type') === 'xref'
  }

};

var XrefPackage = {
  name: 'xref',
  configure: function(config, ref) {
    var toolGroup = ref.toolGroup;
    var disableCollapsedCursor = ref.disableCollapsedCursor;

    config.addNode(Xref);
    config.addComponent('xref', substance.AnnotationComponent);
    config.addConverter('html', XrefHTMLConverter);

    config.addCommand('xref', substance.AnnotationCommand, {
      nodeType: 'xref',
      disableCollapsedCursor: disableCollapsedCursor
    });
    config.addTool('xref', substance.AnnotationTool, {
      toolGroup: toolGroup || 'annotations'
    });
    config.addIcon('xref', { 'fontawesome': 'fa-comment'});
    config.addLabel('xref', 'Comment');
  }
};

var MinimalSwitchTextTypeTool = (function (Tool$$1) {
  function MinimalSwitchTextTypeTool () {
    Tool$$1.apply(this, arguments);
  }

  if ( Tool$$1 ) MinimalSwitchTextTypeTool.__proto__ = Tool$$1;
  MinimalSwitchTextTypeTool.prototype = Object.create( Tool$$1 && Tool$$1.prototype );
  MinimalSwitchTextTypeTool.prototype.constructor = MinimalSwitchTextTypeTool;

  MinimalSwitchTextTypeTool.prototype.render = function render ($$) {
    var this$1 = this;

    var Button = this.getComponent('button');
    var el = $$('div').addClass('sc-minimal-switch-text-type');
    this.props.textTypes.forEach(function (textType) {
      var button = $$(Button, {
        label: textType.name,
        active: this$1.props.currentTextType.name === textType.name,
        disabled: this$1.props.disabled,
        style: this$1.props.style
      }).attr('data-type', textType.name)
        .on('click', this$1.handleClick);
      el.append(button);
    });
    return el
  };

  MinimalSwitchTextTypeTool.prototype.handleClick = function handleClick (e) {
    var newTextType = e.currentTarget.dataset.type;
    e.preventDefault();
    this.context.commandManager.executeCommand(this.getCommandName(), {
      textType: newTextType
    });
  };

  return MinimalSwitchTextTypeTool;
}(substance.Tool));

var SwitchTextTypeCommand = substance.SwitchTextTypePackage.SwitchTextTypeCommand;

var MinimalSwitchTextTypePackage = {
  name: 'minimal-switch-text-type',
  configure: function(config) {
    config.addToolGroup('text');
    config.addCommand('minimal-switch-text-type', SwitchTextTypeCommand, {
      disableCollapsedCursor: true
    });
    config.addTool('minimal-switch-text-type', MinimalSwitchTextTypeTool, {
      toolGroup: 'text'
    });

    config.addLabel('paragraph', 'P');
    config.addLabel('heading1', 'H1');
    config.addLabel('heading2', 'H2');
    config.addLabel('heading3', 'H3');

  }
};

var PACKAGES = {
  'strong': substance.StrongPackage,
  'emphasis': substance.EmphasisPackage,
  'link': substance.LinkPackage,
  'list': substance.ListPackage,
  'table': substance.TablePackage,
  'xref': XrefPackage,
  'heading': substance.HeadingPackage,
  'text-align': substance.TextAlignPackage,
};

var DEFAULT_PACKAGES = ['heading', 'strong', 'emphasis', 'link', 'list', 'table'];

var RichTextArea = (function (Component$$1) {
  function RichTextArea() {
    var this$1 = this;
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    Component$$1.apply(this, args);
    this.cfg = new substance.Configurator().import(RichTextAreaPackage);
    var enabledPackages = this.props.config.enabledPackages || DEFAULT_PACKAGES;
    var defaultOptions = {
      disableCollapsedCursor: true,
      toolGroup: 'annotations'
    };
    enabledPackages.forEach(function (pkg) {
      this$1.cfg.import(PACKAGES[pkg], defaultOptions);
    });
    
    
    if (enabledPackages.indexOf('heading') >= 0) {
      this.cfg.import(MinimalSwitchTextTypePackage);
    }
    this._initDoc(this.props);
  }

  if ( Component$$1 ) RichTextArea.__proto__ = Component$$1;
  RichTextArea.prototype = Object.create( Component$$1 && Component$$1.prototype );
  RichTextArea.prototype.constructor = RichTextArea;

  RichTextArea.prototype.didMount = function didMount () {
    this.registerHandlers();
  };

  RichTextArea.prototype.didUpdate = function didUpdate () {
    this.registerHandlers();
  };

  RichTextArea.prototype.hideOverlays = function hideOverlays () {
    this.refs.editor.hideOverlays();
  };

  RichTextArea.prototype.registerHandlers = function registerHandlers () {
    this.editorSession.onRender('selection', this._onSelectionChanged, this);
  };

  RichTextArea.prototype.unregisterHandlers = function unregisterHandlers () {
    this.editorSession.off(this);
  };

  RichTextArea.prototype.dispose = function dispose () {
    this.unregisterHandlers();
  };

  
  RichTextArea.prototype.blur = function blur () {
    this.editorSession.setSelection(null);
  };

  RichTextArea.prototype._onSelectionPositioned = function _onSelectionPositioned (hints) {
    hints.editorId = this.props.editorId;
    this.emit('selection:positioned', hints);
  };

  RichTextArea.prototype.getChildContext = function getChildContext () {
    return {
      editorId: this.props.editorId,
      scrollPane: this.props.scrollPane
    }
  };

  RichTextArea.prototype.willReceiveProps = function willReceiveProps (props) {
    this.dispose();
    this.empty();
    this._initDoc(props);
  };

  RichTextArea.prototype._initDoc = function _initDoc (props) {
    this.importer = this.cfg.createImporter('html');
    this.doc = this.importer.importDocument(props.html);

    
    this.editorSession = new substance.EditorSession(this.doc, {
      id: this.props.editorId,
      configurator: this.cfg
    });
  };

  RichTextArea.prototype._onSelectionChanged = function _onSelectionChanged () {
    var selectionState = this.editorSession.getSelectionState();
    var activeAnnotation = selectionState.getAnnotationsForType('xref')[0];
    this.emit('selection:changed', {
      activeAnnotation: activeAnnotation,
      editorId: this.props.editorId
    });
  };

  RichTextArea.prototype.render = function render ($$) {
    var el = $$('div').addClass('sc-rich-text-area');
    el.append(
      $$(RichTextAreaEditor, {
        editorSession: this.editorSession,
        editorId: this.props.editorId
      }).ref('editor')
    );
    return el
  };

  RichTextArea.prototype.getHTML = function getHTML () {
    var htmlExporter = this.cfg.createExporter('html');
    
    return htmlExporter.exportDocument(this.doc)
  };

  return RichTextArea;
}(substance.Component));

var BodyScrollPane = substance.BodyScrollPanePackage.BodyScrollPane;

var Forms = (function (EventEmitter$$1) {
  function Forms() {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    EventEmitter$$1.apply(this, args);
    this._editables = {};
    this.bodyScrollPane = BodyScrollPane.mount({}, document.body);
    this.bodyScrollPane.on('selection:positioned', this._onSelectionPositioned, this);
  }

  if ( EventEmitter$$1 ) Forms.__proto__ = EventEmitter$$1;
  Forms.prototype = Object.create( EventEmitter$$1 && EventEmitter$$1.prototype );
  Forms.prototype.constructor = Forms;

  Forms.prototype.dispose = function dispose () {
    this.bodyScrollPane.off(this);
  };

  Forms.prototype.addRichTextArea = function addRichTextArea (editorId, el, config) {
    config = config || {};
    el = substance.DefaultDOMElement.wrapNativeElement(el);
    var html = el.innerHTML;
    
    el.innerHTML = '';
    var richTextArea = RichTextArea.mount({
      scrollPane: this.bodyScrollPane,
      editorId: editorId,
      html: html,
      config: config
    }, el);
    richTextArea.on('selection:positioned', this._onSelectionPositioned, this);
    richTextArea.on('selection:changed', this._onSelectionChanged, this);
    this._editables[editorId] = richTextArea;
    return richTextArea
  };

  Forms.prototype._onSelectionPositioned = function _onSelectionPositioned (hints) {
    this.emit('selection:positioned', hints);
  };

  Forms.prototype._onSelectionChanged = function _onSelectionChanged (params) {
    this.emit('selection:changed', params);
  };

  Forms.prototype.removeRichTextArea = function removeRichTextArea (editorId) {
    this._editables[editorId].off(this);
  };

  Forms.prototype.getHTML = function getHTML (editorId) {
    return this._editables[editorId].getHTML()
  };

  Forms.prototype.setHTML = function setHTML (editorId, html) {
    var editor = this._editables[editorId];
    editor.extendProps({
      html: html
    });
  };

  return Forms;
}(substance.EventEmitter));

window.SubstanceForms = Forms;

})));

//# sourceMappingURL=./substance-forms.js.map
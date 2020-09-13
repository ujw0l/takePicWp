const el = wp.element.createElement;
const { SelectControl, PanelBody } = wp.components;
const { InspectorControls } = wp.blockEditor;
const RichText = wp.editor.RichText
const selectOptions = Object.keys(takePic.files).map(x => takePic.dirUrl + '/' + takePic.files[x]);

wp.blocks.registerBlockType('take-pic/take-pic-block', {
    title: " Take Pic ",
    icon: 'images-alt',
    description: "Take Pic image embed",
    category: 'common',
    attributes: {
        img: { type: 'string', default: selectOptions[selectOptions.length - 1] },
        title: { type: 'string', default: 'Choose title' }
    },
    example: {

    },
    edit: props => {
        return el('div', null, el('div', {},
            el('img', { src: props.attributes.img })),
            el(InspectorControls, null,
                el(PanelBody, null, selectOptions.map(x => el('img', {
                    src: x,
                    onClick: e => props.setAttributes({ img: x }),
                    style: { 'width': '122px', 'height': 'auto', 'border-left': '5px solid rgba(255,255,255,1)' }
                }
                )))))
    },
    save: props => el('div', {}, el('img', { src: props.attributes.img }))
});
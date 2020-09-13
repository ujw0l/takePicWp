const el = wp.element.createElement;
const { SelectControl, PanelBody } = wp.components;
const { InspectorControls, RichText } = wp.blockEditor;
const imgList = Object.keys(takePic.files).map(x => takePic.dirUrl + '/' + takePic.files[x]);

wp.blocks.registerBlockType('take-pic/take-pic-block', {
    title: __("Take Pic", 'take-pic'),
    icon: 'images-alt',
    description: __("Take Pic image embed", 'take-pic'),
    category: 'media',
    keywords: [__('take pic'), __('webcam')],
    attributes: {
        img: { type: 'string', default: imgList[imgList.length - 1] },
        title: { type: 'string', default: __('Choose title', 'take-pic') }
    },
    example: {

    },
    edit: props => {
        return el('div', null, el('div', {},
            el('img', { src: props.attributes.img })),
            el(RichText, { tag: 'p', formattingControls: [], onChange: val => props.setAttributes({ title: val }), value: props.attributes.title, placeholder: props.attributes.title }),
            el(InspectorControls, null,
                el(PanelBody, null, imgList.map(x => el('img', {
                    src: x,
                    onClick: () => props.setAttributes({ img: x }),
                    style: { 'width': '122px', 'cursor': 'pointer', 'height': 'auto', 'border-left': '5px solid rgba(255,255,255,1)' }
                }
                )))))
    },
    save: props => el('div', {}, el('img', { src: props.attributes.img }), el('p', null, props.attributes.title))
});
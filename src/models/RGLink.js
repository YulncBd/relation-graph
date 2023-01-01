
export const json2Line = (originData) => {
  if (originData.from === undefined) {
    throw Error('error,link must has option[from]:', originData);
  }
  if (originData.to === undefined) { throw Error('error,link must has option[to]:', originData); }
  if (typeof originData.from !== 'string') { throw Error('error link from, must be string:', originData); }
  if (typeof originData.to !== 'string') { throw Error('error link to, must be string:', originData); }
  const jsonData = {
    from: originData.from,
    to: originData.to,
    text: originData.text !== undefined ? originData.text : '',
    color: originData.color !== undefined ? originData.color : undefined,
    fontColor:
      originData.fontColor !== undefined ? originData.fontColor : undefined,
    lineWidth:
      originData.lineWidth !== undefined ? originData.lineWidth : undefined,
    lineShape:
      originData.lineShape !== undefined ? originData.lineShape : undefined,
    styleClass:
      originData.styleClass !== undefined ? originData.styleClass : undefined,
    isHide: originData.isHide !== undefined ? originData.isHide : false,
    arrow: originData.arrow !== undefined ? originData.arrow : undefined,
    showStartArrow: originData.showStartArrow !== undefined ? originData.showStartArrow : false,
    showEndArrow: originData.showEndArrow !== undefined ? originData.showEndArrow : true,
    isHideArrow:
      originData.isHideArrow !== undefined ? originData.isHideArrow : undefined,
    hidden: originData.hidden !== undefined ? originData.hidden : false,
    lineDirection:
      originData.lineDirection !== undefined
        ? originData.lineDirection
        : undefined,
    reverseText:
      originData.reverseText !== undefined ? originData.reverseText : undefined,
    data: originData.data !== undefined ? originData.data : {}
  };
  if (jsonData.isHideArrow) {
    jsonData.showEndArrow = false;
    jsonData.isHideArrow = false;
  }
  return jsonData;
};

const _ignore_link_keys = ['arrow', 'id', 'reverseText', 'isReverse'];
export const transLinkToJson = (link, relations) => {
  if (!link) return;
  link.relations.forEach((thisRelation) => {
    const _line_json = {};
    Object.keys(thisRelation).forEach((thisKey) => {
      if (_ignore_link_keys.indexOf(thisKey) === -1) {
        if (thisRelation[thisKey] !== undefined) {
          _line_json[thisKey] = thisRelation[thisKey];
        }
      }
    });
    relations.push(_line_json);
  });
};
export const JUNCTION_POINT_STYLE = {
  border: 'border',
  ltrb: 'ltrb',
  tb: 'tb',
  lr: 'lr'
};
export default {
  json2Line,
  transLinkToJson
};

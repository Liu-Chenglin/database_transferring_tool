// 添加新的字段mapping
const addNewField = () => {
  let parentTag = $('#fields');
  let $newField = $('<div class="field"></div>');

  // 源字段
  const $newSrcField = $('<input type="text" id="src" name="srcField" placeholder="源字段"/>');
  // 目标字段
  const $newDstField = $('<input type="text" id="src" name="dstField" placeholder="目标字段"/>');
  // 新增按钮
  const $newButton = $('<button onclick="addNewField()">新增字段</button>');

  $newField.append($newSrcField);
  $newField.append($newDstField);
  $newField.append($newButton);

  parentTag.append($newField);
}

// 生成sql脚本
const generate = () => {
  const tableInputs = $('.table').find('input');
  const srcTable = tableInputs[0].value;
  const dstTable = tableInputs[1].value;
  let srcList = [];
  let dstList = [];

  // 循环所有的字段添加到列表中
  const fields = $('.fields').find('.field');
  for (let i = 0; i < fields.length; i++) {
    srcList.push(fields[i].children[0].value);
    dstList.push(fields[i].children[1].value);
  }

  let sql = '';
  // 添加头注释
  sql += `-- ${dstTable}\n`;
  sql += 'SELECT\n';
  sql += `'INSERT INTO "${dstTable}"(`;
  // 添加目标字段
  sql += `"${dstList[0]}"`;  
  for (let i = 1; i < dstList.length; ++i) {
    sql += `, "${dstList[i]}"`;  
  }
  sql += `)' + \n`;
  sql += `' VALUES (' + \n`;

  // 添加源字段
  sql += `'"' + ISNULL(CAST(${srcList[0]} AS NVARCHAR), '') + '"' + `;  
  for (let i = 1; i < srcList.length; ++i) {
    sql += `', ' + \n'"' + ISNULL(CAST(${srcList[i]} AS NVARCHAR), '') + '"'\n`;
  }

  sql += `');', * \n`;
  sql += `FROM ${srcTable}`;

  $('.sql').append(sql);
}
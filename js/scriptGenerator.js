// 添加新的字段mapping
const addNewField = () => {
  let parentTag = document.getElementById("fields");
  let newField = document.createElement('div');
  newField.setAttribute('class', 'field');

  // 源字段：
  let srcFieldLabel = document.createElement('label');
  srcFieldLabel.setAttribute('for', 'srcField');
  srcFieldLabel.innerHTML = '源字段：';

  let srcField = document.createElement('input');
  srcField.type = 'text';
  srcField.id = 'src';
  srcField.name = 'srcField';
  srcField.required = true;

  // 目标字段：
  let dstFieldLabel = document.createElement('label');
  dstFieldLabel.setAttribute('for', 'dstField');
  dstFieldLabel.innerHTML = '目标字段：';

  let dstField = document.createElement('input');
  dstField.type = 'text';
  dstField.id = 'src';
  dstField.name = 'dstField';
  dstField.required = true;

  // 新增按钮
  let button = document.createElement('button');
  button.innerHTML = "新增字段";
  button.onclick = function() {
    addNewField();
  };

  newField.append(srcFieldLabel);
  newField.append(srcField);
  newField.append(dstFieldLabel);
  newField.append(dstField);
  newField.append(button);

  parentTag.appendChild(newField);
}

// 生成sql脚本
const generate = () => {
  const tableInputs = $('.table').find('input');
  const srcTable = tableInputs[0].value;
  const dstTable = tableInputs[1].value;

  // const FieldInputs = $('#field-1').find('input');
  // const srcField = FieldInputs[0].value;
  // const dstField = FieldInputs[1].value;
  let srcList = [];
  let dstList = [];

  // 循环所有的字段添加到列表中
  const fields = $('.fields').find('.field');
  for (let i = 0; i < fields.length; i++) {
    srcList.push(fields[i].children[1].value);
    dstList.push(fields[i].children[3].value);
  }

  // 生成脚本  
  let sql = '';
  // 添加头注释
  sql += `-- ${dstTable}\n`;
  sql += 'select\n';
  sql += `'INSERT INTO "${dstTable}"(`;
  // 添加目标字段
  sql += `"${dstList[0]}"`;  
  for (let i = 1; i < dstList.length; ++i) {
    sql += `, "${dstList[i]}"`;  
  }
  sql += `)' + \n`;
  sql += `' VALUES (' + \n`;

  // 添加源字段
  sql += `ISNULL(CAST(${srcList[0]} AS NVARCHAR), '') +\n`;  
  for (let i = 1; i < srcList.length; ++i) {
    sql += `', '' + ISNULL(CAST(${srcList[i]} AS NVARCHAR), '') + '\n`;
  }

  sql += `');', * \n`;
  sql += `FROM ${srcTable};`;

  $('.sql').append(sql);
}
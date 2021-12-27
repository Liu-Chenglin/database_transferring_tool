
$(document).ready(function() {
  $(".alert-success").hide();
});

const showAlert = () => {
  $(".alert-success").fadeTo(3000, 500).fadeOut(500, function() {
    $(".alert-success").fadeOut(500);
  });
}

/* 添加新的字段mapping */
const addNewField = () => {
  let parentTag = $('.field');
  const maxId =  $('.field').children().last().attr('id').slice(-1);  // 获取最大的id
  const id = parseInt(maxId) + 1;

  // 源字段
  const $newSrcField = $(`<div id="src-${id}" class="col-5"><input type="text" id="src" class="form-control src-field-input" placeholder="源字段"/></div>`);
  // 目标字段
  const $newDstField = $(`<div id="dst-${id}" class="col-5"><input type="text" id="dst" class="form-control dst-field-input" placeholder="目标字段"/></div>`);
  // 新增按钮
  const $newButton = $(`<div id="add-${id}" class="col-1"><button type="button" class="btn btn-outline-primary" onclick="addNewField()">+</button></div>`);
  // 删除按钮
  const $deleteButton = $(`<div id="del-${id}" class="col-1"><button type="button" class="btn btn btn-danger" onclick="deleteRow(${id})">×</button></div>`);
  
  parentTag.append($newSrcField);
  parentTag.append($newDstField);
  parentTag.append($newButton);
  parentTag.append($deleteButton);
}

/* 生成sql脚本 */
const generate = () => {
  const srcTable = $('#srcTable').val();
  const dstTable = $('#dstTable').val();
  let srcList = [];
  let dstList = [];
  let deleteMarkFlag = false;

  if ($('#addDeleteMark').is(":checked")) {
    deleteMarkFlag = true;
  }

  // 获取源字段列表
  const srcFields = $('.src-field-input');
  for (let i = 0; i < srcFields.length; i++) {
    srcList.push(srcFields[i].value);
  }

  // 获取目标字段列表
  const dstFields = $('.dst-field-input');
  for (let i = 0; i < dstFields.length; i++) {
    dstList.push(dstFields[i].value);
  }

  if (dstList.length != srcList.length) {
    alert("请输入完整的字段映射关系");
    return;
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
  if (deleteMarkFlag) {
    sql += ', "DELETE_MARK"';
  }
  sql += `)' + \n`;
  sql += `' VALUES (' + \n`;

  // 添加源字段
  sql += `'''' + ISNULL(CAST(${srcList[0]} AS NVARCHAR), '') + '''' + `;  
  for (let i = 1; i < srcList.length; ++i) {
    sql += `', ' + \n'''' + ISNULL(CAST(${srcList[i]} AS NVARCHAR), '') + '''' + `;
  }
  if (deleteMarkFlag) {
    sql += `\n', ' + '''N''' + `;
  }
  sql += `');', * \n`;
  sql += `FROM ${srcTable}`;

  $('.sql').append(sql);
}

/* 复制sql脚本到剪切板 */
const copyScript = () => {
  const $sql = $('.sql').val();

  if (''  === $sql) {
    alert('当前没有脚本可以复制，请先生成脚本!');
  }
  else {
    document.getElementsByClassName('sql')[0].select();
    document.execCommand("copy");
    showAlert();

  }
}

/* 删除一行 */
const deleteRow = (id) => {
  $(`#src-${id}`).remove();
  $(`#dst-${id}`).remove();
  $(`#add-${id}`).remove();
  $(`#del-${id}`).remove();
}
function getTagTbodyId (tag) {
  return 'tbody-tag-' + tag
}

function getCheckClass (check) {
  return ('check-' + check.id).replace(/\./g, '-')
}

function createTagDiv (tag) {
  let tagDiv = document.createElement('div')
  let tagId = 'tag-' + tag
  tagDiv.setAttribute('id', tagId)
  tagDiv.innerHTML = `
      <a href="#${tagId}" title="Permalink to this tag"><h2>${tag[0].toUpperCase() + tag.slice(1)}</h2></a>
      <table class="table table-bordered table-hover table-striped">
        <tbody id="${getTagTbodyId(tag)}" />
      </table>
    `
  return tagDiv
}

function createLoadingCheckRows (check) {
  check.tags.forEach((tag) => {
    if (tag[0] !== '_') {
      let checkRow = document.createElement('tr')
      checkRow.innerHTML = `<td>Loading check ${check.name}</td>`
      checkRow.className = 'warning ' + getCheckClass(check)
      document.getElementById(getTagTbodyId(tag)).appendChild(checkRow)
    }
  })
}

function fillCheckRowWithResult (row, checkName, checkResult) {
  let rowName = checkResult.obj ? `${checkName}: ${checkResult.obj}`: `${checkName}`
  let rowMsg = checkResult.msg ? checkResult.msg: ''
  row.innerHTML = `
    <td class="align-right" style="width:25%">${rowName}</td>
    <td class="align-center" style="width:5%;text-align: center;">${checkResult.result}</td>
    <td>${rowMsg}</td>
  `
  row.classList.remove('warning')
  row.classList.add({
    OK: 'success',
    WARN: 'warning'
  }[checkResult.result] || 'danger')
}

function fillCheckRows (checkResults) {
  checkResults.sort((check1, check2) => check1.name.localeCompare(check2.name))
  checkResults.forEach((check) => {
    Array.from(document.getElementsByClassName(getCheckClass(check))).forEach((checkRow) => {
      check.results.forEach((result, index) => {
        if (index === 0) {
          fillCheckRowWithResult(checkRow, check.name, result)
        } else {
          let newCheckRow = document.createElement('tr')
          fillCheckRowWithResult(newCheckRow, check.name, result)
          // This will append newCheckRow after checkRow (even when checkRow was last)
          checkRow.parentNode.insertBefore(newCheckRow, checkRow.nextSibling)
        }
      })
    })
  })
}

async function loadCheckResults (checks) {
  if (checks.length < 1) {
    return
  }
  const formData = new FormData()
  checks.forEach((check) => formData.append('checkId', check.id))
  try {
    const response = await fetch('/selftest/checks/', {credentials: 'same-origin', method: 'POST', body: formData})
    if (response.ok) {
      fillCheckRows(await response.json())
    } else {
      throw new Error(`${response.status} - ${response.statusText}`)
    }
  } catch (error) {
    fillCheckRows(checks.map((check) => {
      let copy = Object.assign({}, check)
      copy.results = [{result: 'KO', msg: `Error loading check ${copy.id} results: ${error}`}]
      return copy
    }))
  }
}

function createChecks (checks) {
  // Create tag categories
  checks.sort((check1, check2) => check1.name.localeCompare(check2.name))
  // [].concat(...list_of_lists) is used to flatten list_of_lists
  // where list_of_lists looks like this: [[tag1, tag2], [tag3], ...]
  let tags = new Set([].concat(
    ...checks.map((check) => check.tags.filter((tag) => tag[0] !== '_'))
  ))
  let root = document.getElementById('checks-root')
  Array.from(tags).sort().forEach((tag) => { root.appendChild(createTagDiv(tag)) })

  // Create placeholder while we load the results from Django
  checks.forEach(createLoadingCheckRows)

  // Load the actual results and fill the rows
  const syncChecks = checks.filter((check) => !check.tags.includes('_async'))
  loadCheckResults(syncChecks)
  const asyncChecks = checks.filter((check) => check.tags.includes('_async'))
  asyncChecks.forEach((check) => loadCheckResults([check]))
}

document.addEventListener('DOMContentLoaded', function () {
  fetch('/selftest/checks/', {credentials: 'same-origin'})
    .then((response) => response.json())
    .then(createChecks)
    .catch((err) => { console.log(err) })
})

export function simplifyInfo(selectionSet: any): any {
  const selectedFields = selectionSet?.selections;
  const fields: any = {};
  const excludedFields = ['__typename', 'ayah_marker'];

  selectedFields.map((selection: any) => {
    const fieldName = selection.name.value;

    if (excludedFields.includes(fieldName)) {
      return;
    }

    if (selection.selectionSet) {
      fields[fieldName] = simplifyInfo(selection.selectionSet);
    } else {
      fields[fieldName] = true;
    }
  });

  return fields;
}

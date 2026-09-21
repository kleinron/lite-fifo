const fs = require('fs');
const path = require('path');
const ts = require('typescript');

/**
 * Post-process `tsc` emit:
 * - strip private class members so published types expose only the public API
 * - drop internal `util` declarations (not part of the package entry)
 */
const typesDir = path.join(__dirname, '..', 'types');

function stripPrivateMembers (fileName, sourceText) {
  const sourceFile = ts.createSourceFile(
    fileName,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );

  const transformer = (context) => {
    const { factory } = context;
    const visit = (node) => {
      if (ts.isClassDeclaration(node)) {
        const members = node.members.filter(member => {
          const modifiers = ts.canHaveModifiers(member) ? ts.getModifiers(member) : undefined;
          return !modifiers || !modifiers.some(modifier => modifier.kind === ts.SyntaxKind.PrivateKeyword);
        });
        return factory.updateClassDeclaration(
          node,
          node.modifiers,
          node.name,
          node.typeParameters,
          node.heritageClauses,
          members
        );
      }
      return ts.visitEachChild(node, visit, context);
    };
    return (node) => ts.visitNode(node, visit);
  };

  const result = ts.transform(sourceFile, [transformer]);
  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
    removeComments: false
  });
  const transformed = result.transformed[0];
  result.dispose();
  return printer.printFile(transformed);
}

for (const file of fs.readdirSync(typesDir)) {
  const fullPath = path.join(typesDir, file);
  if (file === 'util.d.ts' || file === 'util.d.ts.map') {
    fs.unlinkSync(fullPath);
    continue;
  }
  if (!file.endsWith('.d.ts')) {
    continue;
  }
  const original = fs.readFileSync(fullPath, 'utf8');
  if (!/\bprivate\b/.test(original)) {
    continue;
  }
  const stripped = stripPrivateMembers(file, original);
  const withoutMapComment = stripped.replace(/\n\/\/# sourceMappingURL=.*\n?$/, '\n');
  fs.writeFileSync(fullPath, withoutMapComment);
  const mapPath = fullPath + '.map';
  if (fs.existsSync(mapPath)) {
    fs.unlinkSync(mapPath);
  }
}

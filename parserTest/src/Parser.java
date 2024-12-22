import java.util.*;

public class Parser {

    private String expression;
    private int index;
    private Map<String, Object> variables = new HashMap<>();
    private String str = "";

    public Parser(String expression) {
        this.expression = expression;
        this.index = 0;
    }

    public boolean parseExpr() {
        boolean valid = parseStatements();
        return valid && index == expression.length();
    }

    private boolean parseStatements() {
        while (index < expression.length()) {
            skipWhitespaceAndComments();

            if (index >= expression.length()) {
                break;
            }

            if (!parseStatement()) {
                return false;
            }

            skipWhitespaceAndComments();
            if (index < expression.length() && expression.charAt(index) == ';') {
                index++;
            } else if (index < expression.length()) {
                return false;
            }
        }
        return true;
    }

    private boolean parseStatement() {
        skipWhitespaceAndComments();
        if (parseVariableAssignment()) {
            return true;
        }
        if (parsePrintStatement()) {
            return true;
        }
        return evaluateExpression() != null;
    }

    private boolean parseVariableAssignment() {
        skipWhitespaceAndComments();
        int start = index;
        while (index < expression.length() && Character.isLetter(expression.charAt(index))) {
            index++;
        }
        if (start == index) {
            return false;
        }
        String varName = expression.substring(start, index);
        skipWhitespaceAndComments();
        if (index >= expression.length() || expression.charAt(index) != '=') {
            index = start;
            return false;
        }
        index++;
        skipWhitespaceAndComments();
        Object value = evaluateExpression();
        if (value == null) {
            return false;
        }
        variables.put(varName, value);
        return true;
    }

    public String getResultStr() {
        return this.str;
    }

    private boolean parsePrintStatement() {
        skipWhitespaceAndComments();
        if (index + 5 <= expression.length() && expression.substring(index, index + 5).equals("print")) {
            index += 5;
            skipWhitespaceAndComments();
            if (index >= expression.length() || expression.charAt(index) != '(') {
                return false;
            }
            index++;
            skipWhitespaceAndComments();
            Object value = evaluateExpression();
            if (value == null) {
                return false;
            }
            skipWhitespaceAndComments();
            if (index >= expression.length() || expression.charAt(index) != ')') {
                return false;
            }
            index++;
            str += value.toString() + "\n";
            return true;
        }
        return false;
    }

    private Object evaluateExpression() {
        skipWhitespaceAndComments();
        Object result = parseTerm();
        while (index < expression.length()) {
            skipWhitespaceAndComments();
            if (index >= expression.length()) {
                break;
            }
            char operator = expression.charAt(index);
            if (operator == '+' || operator == '-') {
                index++;
                Object right = parseTerm();
                if (right == null) {
                    return null;
                }
                result = applyOperator(operator, result, right);
            } else {
                break;
            }
        }
        return result;
    }

    private Object parseTerm() {
        skipWhitespaceAndComments();
        Object result = parseFactor();
        while (index < expression.length()) {
            skipWhitespaceAndComments();
            if (index >= expression.length()) {
                break;
            }
            char operator = expression.charAt(index);
            if (operator == '*' || operator == '/') {
                index++;
                Object right = parseFactor();
                if (right == null) {
                    return null;
                }
                result = applyOperator(operator, result, right);
            } else {
                break;
            }
        }
        return result;
    }

    private Object parseFactor() {
        skipWhitespaceAndComments();
        if (index >= expression.length()) {
            return null;
        }

        if (Character.isDigit(expression.charAt(index))) {
            int start = index;
            while (index < expression.length()
                    && (Character.isDigit(expression.charAt(index)) || expression.charAt(index) == '.')) {
                index++;
            }
            return Double.parseDouble(expression.substring(start, index));
        }

        if (expression.charAt(index) == '\"') {
            index++;
            int start = index;
            while (index < expression.length() && expression.charAt(index) != '\"') {
                index++;
            }
            if (index >= expression.length()) {
                return null;
            }
            String result = expression.substring(start, index);
            index++;
            return result;
        }

        if (Character.isLetter(expression.charAt(index))) {
            int start = index;
            while (index < expression.length() && Character.isLetterOrDigit(expression.charAt(index))) {
                index++;
            }
            String varName = expression.substring(start, index);
            if (!variables.containsKey(varName)) {
                return null;
            }
            return variables.get(varName);
        }

        if (expression.charAt(index) == '(') {
            index++;
            Object result = evaluateExpression();
            if (index >= expression.length() || expression.charAt(index) != ')') {
                return null;
            }
            index++;
            return result;
        }

        return null;
    }

    private Object applyOperator(char operator, Object left, Object right) {
        if (left instanceof Number && right instanceof Number) {
            double l = ((Number) left).doubleValue();
            double r = ((Number) right).doubleValue();
            switch (operator) {
                case '+':
                    return l + r;
                case '-':
                    return l - r;
                case '*':
                    return l * r;
                case '/':
                    if (r == 0) {
                        throw new ArithmeticException("Division by zero");
                    }
                    return l / r;
            }
        }
        return null;
    }

    private void skipWhitespaceAndComments() {
        while (index < expression.length()) {
            char c = expression.charAt(index);
            if (Character.isWhitespace(c) || c == '\n' || c == '\r') {
                index++;
            } else if (c == '/' && index + 1 < expression.length()) {
                if (expression.charAt(index + 1) == '/') {
                    index += 2;
                    while (index < expression.length() && expression.charAt(index) != '\n'
                            && expression.charAt(index) != '\r') {
                        index++;
                    }
                } else if (expression.charAt(index + 1) == '*') {
                    index += 2;
                    while (index + 1 < expression.length()
                            && !(expression.charAt(index) == '*' && expression.charAt(index + 1) == '/')) {
                        index++;
                    }
                    index += 2;
                } else {
                    break;
                }
            } else {
                break;
            }
        }
    }

    public static void main(String[] args) {
        if (args.length != 1) {
            System.out.println("Usage: java Parser \"<expression>\"");
            return;
        }

        String expression = args[0];
        Parser parser = new Parser(expression);
        parser.parseExpr();
        System.out.println(parser.getResultStr());
    }
}

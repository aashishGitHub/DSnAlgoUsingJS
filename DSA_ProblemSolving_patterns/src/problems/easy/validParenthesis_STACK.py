

#FYI Python implementation

closing_brackets = [')', '}', ']']
opening_brackets = ['(', '{', '[']

def is_pair(start, end):
    if not start:
        return False
    return opening_brackets.index(start) != -1 and opening_brackets.index(start) == closing_brackets.index(end)

def is_valid(s):
    stack = []
    for item in s:
        if stack and item in closing_brackets:
            # closing bracket is found
            last_item = stack.pop()
            if is_pair(last_item, item):
                continue
            else:
                return False
        else:
            # opening bracket is found
            stack.append(item)
    return len(stack) == 0

print(is_valid('((})){{[}]'))
print(is_valid('(({}))'))
#
# Directories
#
ROOT           := $(shell pwd)
NODE_MODULES   := $(ROOT)/node_modules
NODE_BIN       := $(NODE_MODULES)/.bin
TOOLS          := $(ROOT)/tools

#
# Tools and binaries
#
ESLINT		:= $(NODE_BIN)/eslint
JSCS		:= $(NODE_BIN)/jscs
UGLIFY      := $(NODE_BIN)/uglifyjs
MOCHA       := $(NODE_BIN)/mocha
_MOCHA      := $(NODE_BIN)/_mocha
ISTANBUL    := $(NODE_BIN)/istanbul
COVERALLS   := $(NODE_BIN)/coveralls
NSP         := $(NODE_BIN)/nsp
NPM		    := npm
NSP_BADGE   := $(TOOLS)/nspBadge.js


#
# Directories
#
LIB_DIR  	   := $(ROOT)/lib
TEST_DIR       := $(ROOT)/test
COVERAGE_DIR   := $(ROOT)/coverage
DIST_DIR       := $(ROOT)/dist


#
# Files and globs
#
GIT_HOOK_SRC    = '../../tools/githooks/pre-push'
GIT_HOOK_DEST   = '.git/hooks/pre-push'
SHRINKWRAP     := $(ROOT)/npm-shrinkwrap.json
LCOV           := $(ROOT)/coverage/lcov.info
ALL_FILES      := $(shell find $(LIB_DIR) $(TEST_DIR) -name '*.js' -type f)


#
# Targets
#
node_modules: package.json
	$(NPM) install
	@touch $(NODE_MODULES)


.PHONY: all
all: clean node_modules lint codestyle test build


.PHONY: githooks
githooks:
	@ln -s $(GIT_HOOK_SRC) $(GIT_HOOK_DEST)


.PHONY: lint
lint: node_modules $(ALL_FILES)
	@$(ESLINT) $(ALL_FILES)


.PHONY: codestyle
codestyle: node_modules $(ALL_FILES)
	@$(JSCS) $(ALL_FILES)


.PHONY: codestyle-fix
codestyle-fix: node_modules $(ALL_FILES)
	@$(JSCS) $(ALL_FILES) --fix


.PHONY: nsp
nsp: node_modules $(ALL_FILES)
	@$(NPM) shrinkwrap --dev
	@($(NSP) check) | $(NSP_BADGE)
	@rm $(SHRINKWRAP)


.PHONY: prepush
prepush: node_modules lint codestyle test nsp


.PHONY: test
test: node_modules $(ALL_FILES)
	@$(MOCHA) -R spec --full-trace


.PHONY: coverage
coverage: node_modules $(ALL_FILES)
	@$(ISTANBUL) cover $(_MOCHA) --report lcovonly -- -R spec


.PHONY: report-coverage
report-coverage: coverage
	@cat $(LCOV) | $(COVERALLS)


.PHONY: clean-coverage
clean-coverage:
	@rm -rf $(COVERAGE_FILES)


.PHONY: clean
clean: clean-coverage
	@rm -rf $(NODE_MODULES)


#
## Debug -- print out a a variable via `make print-FOO`
#
print-%  : ; @echo $* = $($*)

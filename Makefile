help:
	@echo "make init - clone the theme"
	@echo "make hugo - serve locally, include drafts & future posts"
	@echo "make hugo_static - gen static page and use python http server to serve"
	@echo "make hugo_clean - clear all generated static files"
init:
	git submodule update --init
hugo:
	hugo server -D --disableFastRender -p 1313
hugo_static:
	hugo
	cd public/; python3 -m http.server 8000
hugo_clean:
	rm -rf public
	rm -rf resources



/**
 * Overlay HTML for big teasers and articles
 * @type {string}
 */
const overlayHTML = `
    <div class="adbustoverlay">
        <div class="adbust_top">#ADBlocker <bt>
        <img src=https://uploads-ssl.webflow.com/5ab163de19104964ce8a64b9/5ade72b2050ac30bd3396f97_spoofs_corpo_04.jpg>
        </div> 
        <div class="adbustoverlay_bottom">
            100% Werbe-inhaltsfrei<br>
            Für Sie gebustet von Bobby & Flo!<br>
            mit Inhalten von Adbusters Media Foundation. <br>
            <img src=https://uploads-ssl.webflow.com/5ab163de19104964ce8a64b9/5ade72b2050ac30bd3396f97_spoofs_corpo_04.jpg>
        </div>
    </div>
`;



/* oben Bilder einfügen &  an Größe des geblockten Contents anpassen?*/


/**
 * Overlay HTML for small teasers
 * @type {string}
 */
const overlayHTMLSmall = `
    <div class="adbustoverlay">
        <div class="adbustoverlay_top">#AD_Bbust</div>
    </div>
`;

/**
 * Convert HTML string to DOM Node
 * @param html {string}
 * @returns {Element}
 */
function parseHtml(html) {
    const parser = new DOMParser();
    const parsed = parser.parseFromString(html, 'text/html');
    const overlay = parsed.getElementsByClassName('adbustoverlay')[0];
    return overlay;
}

/**
 * Overlay DOM Node
 * @type {Element}
 */
const overlayNode = parseHtml(overlayHTML);

/**
 * Overlay DOM Node for small teasers
 * @type {Element}
 */
const overlaySmallNode = parseHtml(overlayHTMLSmall);

// const fs = require('fs');
// import readFileSync from 'fs';

/**
 * The blocker class searches for an xpath expression and blocks content on basis of css selectors
 */
export class Blocker {
    /**
     *
     * @param selectorList lst of css selectors and overlay types
     * @param xpathExpression xpath expression
     */
    constructor(selectorList, xpathExpression) {
        this.selectorList = selectorList;
        if (xpathExpression)
        {
            this.xpathExpression = xpathExpression;
        } else {
            const text = readFileSync("https://raw.githubusercontent.com/easylist/easylist/master/easylist/easylist_adservers.txt", "utf-8");
            this.xpathExpression = ".//*[contains(text(), const readline = require('readline');"
          
        }
    }

    modifyContent(elements) {
        console.log("#### Suche nach Inhalten ####");
        let nodeConfigurations =  [];
        for (let j = 0; j < elements.length; j++) {
            let element = elements[j];
            let iterator = document.evaluate(this.xpathExpression, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
            try {
                let node = iterator.iterateNext();
                while (node) {
                    console.log("Found AD content");
                    for(let i = 0; i< this.selectorList.length; i++)
                    {
                        let selector = this.selectorList[i].selector;
                        let ancestorTeaser = node.closest(selector);
                        if (ancestorTeaser)
                        {
                            if (!ancestorTeaser.classList.contains('adbust'))
                            {
                                nodeConfigurations.push({
                                    element: ancestorTeaser,
                                    type: this.selectorList[i].type
                                });
                            }
                            // Wrapper found
                            break;
                        }
                    }
                    node = iterator.iterateNext();
                }
            }
            catch (e)
            {
                console.error( 'Error: Document tree modified during iteration ' + e );
            }
        }
        addBlocker(nodeConfigurations);
    }

    watchPageForMutations() {
      let mutationObserver = new MutationObserver(mutations => {
        let addedNodes = [];
        for(let i=0; i<mutations.length; ++i) {
            // look through all added nodes of this mutation
            for(let j=0; j<mutations[i].addedNodes.length; ++j) {
                if (mutations[i].addedNodes[j].classList && !mutations[i].addedNodes[j].classList.contains('adbustoverlay')) {
                    addedNodes.push(mutations[i].addedNodes[j]);
                }
            }
        }
        if (addedNodes.length > 0) {
          this.modifyContent(addedNodes);
        }
      });
      mutationObserver.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    }
}

/**
 * Add overlays to a list of node configurations
 * @param nodeConfigurations
 */
export function addBlocker(nodeConfigurations) {
    nodeConfigurations.forEach(function(nodeConfiguration) {
        console.log("Adding Blocker to wrapper");
        if (!nodeConfiguration.element.classList.contains('abust')) {
            nodeConfiguration.element.classList.add('adbust');
            let overlay;
            if (nodeConfiguration.type === 'big') {
                overlay = overlayNode.cloneNode(true);
            } else {
                overlay = overlaySmallNode.cloneNode(true);
            }
            nodeConfiguration.element.insertBefore(overlay, nodeConfiguration.element.firstChild);
        }
    });
}


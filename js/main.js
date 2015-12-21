(function() {
    'use strict';
    var cardGameApp = angular.module("cgApp", []);
    cardGameApp.controller('CardGameCtrl', ['$timeout', '$interval', function($timeout, $interval) {
        var self = this;
        self.totalPairToWin = 1;
        var init = function() {
            // Choose 18 random candidates from 52 cards
            var totalCardNumber = 52;
            var allCards = [];
            for (var i = 1; i <= 52; i++) {
                allCards.push(i);
            }
            allCards.sort(function() {
                return .5 - Math.random();
            });
            var candidates = allCards.slice(0, 18);
            // Generate 36 candidates from 18 candidates
            candidates = candidates.concat(candidates);
            candidates.sort(function() {
                return .5 - Math.random();
            });
            self.cardList = [];
            for (var i = 0; i < 36; i++) {
                self.cardList[i] = {};
                self.cardList[i].cardValue = candidates[i];
                self.cardList[i].cardID = i + 1;
            }
            // Used to check correction of pairs
            self.correctPair = 0;
            self.lastCard = {};
            self.isWaitingForChecking = false;
            self.moves = 0;
            self.times = 0;
            self.started = false;
        }
        init();
        self.clickStart = function() {
            $('#start-btn').attr('disabled', true)
            $('.cards').removeClass('semi-transparent');
            self.victoryMessage = "";
            self.started = true;
            $interval(function() {
                self.times += 1;
            }, 1000);
        }
        /* Function to handle card clicked event */
        self.clickCard = function(card) {
            if(!self.started){
                return;
            }
            var cardID = card.cardID;
            var currentCardObj = $('#' + cardID);
            /* If clicked card is not visible, show it */
            if (!currentCardObj.hasClass('fade')) {
                currentCardObj.addClass('fade');
                /* If there is a card is shown and waiting for a new card to check if they are a pair
                	Check new card and last card
                 */
                if (self.isWaitingForChecking) {
                    /* Add correct pairs, if correct pairs equals to total pairs need to find, show victory message */
                    if (card.cardValue == self.lastCard.cardValue) {
                        self.correctPair += 1;
                        if (self.correctPair >= self.totalPairToWin) {
                            self.victoryProcess();
                            return;
                        }
                    } else {
                        /* Hide 2 cards if they are not a pair */
                        var lastCardObj = $('#' + self.lastCard.cardID);
                        $timeout(function() {
                            currentCardObj.removeClass('fade');
                            lastCardObj.removeClass('fade');
                        }, 1000);
                    }
                    /* After checking, remove last card and change status isWaitingForChecking = false */
                    self.lastCard = {};
                    self.isWaitingForChecking = false;
                    self.moves += 1;
                } else {
                    /* Store last card and change status isWaitingForChecking = false */
                    self.isWaitingForChecking = true;
                    self.lastCard = card;
                }
            }
        }
        self.victoryProcess = function() {
            $('#start-btn').attr('disabled', false)
            $('.cards').addClass('semi-transparent');
            self.victoryMessage = "You won!";
            init();
        }
    }]);
})();